// Cloudflare Workers Instagram proxy
// 1) Create an Instagram Basic Display App and user token.
// 2) Exchange for a long-lived token and store it as a secret: IG_TOKEN
// 3) Deploy this worker and set INSTAGRAM_USER_ID and IG_TOKEN as variables/secrets.
// 4) Set INSTAGRAM_PROXY_URL in assets/scripts/config.js to this worker URL.

export default {
  async fetch(request, env) {
    const userId = env.INSTAGRAM_USER_ID; // numeric ID
    const token = env.IG_TOKEN; // long-lived token
    const limit = 12;
    if (!userId || !token) return new Response('Missing config', { status: 500 });
    try {
      const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url';
      const api = `https://graph.instagram.com/${userId}/media?fields=${fields}&access_token=${token}&limit=${limit}`;
      const res = await fetch(api, { cf: { cacheTtl: 60, cacheEverything: true } });
      if (!res.ok) return new Response('Upstream error', { status: 502 });
      const data = await res.json();
      const posts = (data.data || []).map(m => ({
        id: m.id,
        image: m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url,
        url: m.permalink,
      }));
      const body = JSON.stringify({ profile: `https://instagram.com/${env.INSTAGRAM_HANDLE || ''}`, posts });
      return new Response(body, { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=60' } });
    } catch (e) {
      return new Response('Error', { status: 500 });
    }
  }
};

