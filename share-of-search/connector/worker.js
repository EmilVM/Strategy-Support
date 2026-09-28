/**
 * Share of Search: live connector
 * ----------------------------------------------------------------------------
 * A small Cloudflare Worker that fetches Google Trends "interest over time"
 * for up to five search terms and returns it in a format the tracker at
 * https://strategy-support.com/share-of-search/ understands.
 *
 * Why it's needed: Google has no open Trends API (the official one is a
 * closed alpha), and Google Trends refuses requests made directly from a web
 * page. The worker makes the request from Cloudflare instead.
 *
 * Deploy (free):
 *   1. Sign up at https://dash.cloudflare.com, then go to
 *      Workers & Pages -> Create -> Worker. Deploy it, then click
 *      "Edit code", replace the code with this file and deploy again.
 *   2. Recommended: create a SerpApi account (https://serpapi.com) and add your
 *      key under Settings -> Variables and Secrets as a secret named
 *      SERPAPI_KEY. SerpApi is the most reliable route. Without the key, the
 *      worker asks Google Trends directly, and Google sometimes refuses
 *      requests from cloud servers (HTTP 429).
 *   3. Optional: set ALLOWED_ORIGINS (comma separated) if you want to use the
 *      tracker from another domain. By default only strategy-support.com and
 *      local testing are allowed.
 *   4. Paste the worker URL (https://<name>.<you>.workers.dev) into
 *      "Live connection" on the tracker page.
 *
 * Request:  GET /?q=Brand A,Brand B,Brand C&geo=DK&time=today 5-y
 * Response: { source, terms, geo, time, points: [{ t: <ms>, v: [..] }] }
 */

const DEFAULT_ORIGINS = [
  'https://strategy-support.com',
  'https://www.strategy-support.com',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];
const TIME_PATTERN = /^(today \d{1,2}-[my]|today 5-y|now \d{1,2}-[dH]|all|\d{4}-\d{2}-\d{2} \d{4}-\d{2}-\d{2})$/;
const CACHE_SECONDS = 6 * 60 * 60;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',') : DEFAULT_ORIGINS).map(s => s.trim()).filter(Boolean);
    const allowOrigin = allowed.includes('*') ? '*' : (allowed.includes(origin) ? origin : allowed[0]);
    const cors = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Accept, Content-Type',
      'Vary': 'Origin'
    };
    const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors, ...extra }
    });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return json({ error: 'Only GET is supported.' }, 405);

    const url = new URL(request.url);
    const terms = (url.searchParams.get('q') || '')
      .split(',').map(s => s.trim()).filter(Boolean).slice(0, 5)
      .map(s => s.slice(0, 100));
    const geo = (url.searchParams.get('geo') || '').toUpperCase();
    const time = (url.searchParams.get('time') || 'today 5-y').trim();

    if (terms.length < 2) return json({ error: 'Add at least two search terms.' }, 400);
    if (geo && !/^[A-Z]{2}(-[A-Z0-9]{1,3})?$/.test(geo)) return json({ error: 'The market must be an ISO country code such as DK or GB.' }, 400);
    if (!TIME_PATTERN.test(time)) return json({ error: 'That period isn’t supported.' }, 400);

    // Cache identical requests for a few hours to stay polite to Google.
    const cacheKey = new Request(`https://cache.share-of-search/${encodeURIComponent(JSON.stringify([terms, geo, time]))}`);
    const cache = caches.default;
    const hit = await cache.match(cacheKey);
    if (hit) {
      const body = await hit.json();
      return json(body, 200, { 'X-Cache': 'HIT' });
    }

    try {
      const body = env.SERPAPI_KEY
        ? await viaSerpApi(terms, geo, time, env.SERPAPI_KEY)
        : await viaGoogle(terms, geo, time);
      ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${CACHE_SECONDS}` }
      })));
      return json(body);
    } catch (err) {
      return json({ error: err.message || 'The request to Google Trends failed.' }, 502);
    }
  }
};

async function viaSerpApi(terms, geo, time, key) {
  const params = new URLSearchParams({
    engine: 'google_trends',
    data_type: 'TIMESERIES',
    q: terms.join(','),
    date: time,
    tz: '0',
    api_key: key
  });
  if (geo) params.set('geo', geo);
  const res = await fetch(`https://serpapi.com/search.json?${params}`);
  const data = await res.json().catch(() => null);
  if (!res.ok || !data || data.error) throw new Error(`SerpApi: ${(data && data.error) || res.status}`);
  const timeline = data.interest_over_time && data.interest_over_time.timeline_data;
  if (!Array.isArray(timeline) || !timeline.length) throw new Error('SerpApi returned no data for these terms.');
  const points = timeline.map(p => ({
    t: Number(p.timestamp) * 1000,
    v: terms.map((_, i) => {
      const cell = p.values && p.values[i];
      if (!cell) return null;
      if (cell.value === '<1') return 0.5;
      const n = Number(cell.extracted_value != null ? cell.extracted_value : cell.value);
      return Number.isFinite(n) ? n : null;
    })
  }));
  return { source: 'serpapi', terms, geo, time, points };
}

async function viaGoogle(terms, geo, time) {
  // A first visit gives the cookie Google expects on the API calls.
  let cookie = '';
  try {
    const home = await fetch('https://trends.google.com/trends/?geo=' + (geo || 'US'), { headers: { 'User-Agent': UA } });
    const setCookie = home.headers.get('set-cookie') || '';
    const nid = setCookie.match(/NID=[^;]+/);
    if (nid) cookie = nid[0];
  } catch (_) { /* carry on without */ }
  const headers = { 'User-Agent': UA, 'Accept': 'application/json, text/plain, */*', 'Accept-Language': 'en-US,en;q=0.9' };
  if (cookie) headers.Cookie = cookie;

  const explore = {
    comparisonItem: terms.map(keyword => ({ keyword, geo, time })),
    category: 0,
    property: ''
  };
  const exploreRes = await fetch(`https://trends.google.com/trends/api/explore?hl=en-US&tz=0&req=${encodeURIComponent(JSON.stringify(explore))}`, { headers });
  if (exploreRes.status === 429) throw new Error('Google Trends is rate limiting this connector (429). Try again in a minute, or add a SERPAPI_KEY to the worker.');
  if (!exploreRes.ok) throw new Error(`Google Trends answered ${exploreRes.status}.`);
  const exploreData = parseGoogleJSON(await exploreRes.text());
  const widget = (exploreData.widgets || []).find(w => w.id === 'TIMESERIES');
  if (!widget) throw new Error('Google Trends returned no time series for these terms.');

  const lineRes = await fetch(`https://trends.google.com/trends/api/widgetdata/multiline?hl=en-US&tz=0&req=${encodeURIComponent(JSON.stringify(widget.request))}&token=${encodeURIComponent(widget.token)}`, { headers });
  if (lineRes.status === 429) throw new Error('Google Trends is rate limiting this connector (429). Try again in a minute, or add a SERPAPI_KEY to the worker.');
  if (!lineRes.ok) throw new Error(`Google Trends answered ${lineRes.status}.`);
  const lineData = parseGoogleJSON(await lineRes.text());
  const timeline = lineData.default && lineData.default.timelineData;
  if (!Array.isArray(timeline) || !timeline.length) throw new Error('Google Trends returned an empty series. Check the spelling of the terms.');

  const points = timeline
    .filter(p => !p.isPartial)
    .map(p => ({
      t: Number(p.time) * 1000,
      v: terms.map((_, i) => {
        const formatted = p.formattedValue && p.formattedValue[i];
        if (formatted === '<1') return 0.5;
        const n = Number(p.value && p.value[i]);
        return Number.isFinite(n) ? n : null;
      })
    }));
  return { source: 'google-trends', terms, geo, time, points };
}

// Google prefixes its JSON with ")]}'," to stop it being run as a script.
function parseGoogleJSON(text) {
  const start = text.indexOf('{');
  if (start < 0) throw new Error('Google Trends sent an unexpected response.');
  return JSON.parse(text.slice(start));
}
