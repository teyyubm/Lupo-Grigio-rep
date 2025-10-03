// Netlify Functions Instagram proxy
// Set environment variables in Netlify UI or netlify.toml:
//   INSTAGRAM_USER_ID=<numeric id>
//   IG_TOKEN=<long-lived token>
//   INSTAGRAM_HANDLE=<handle>

export const handler = async () => {
  const userId = process.env.INSTAGRAM_USER_ID;
  const token = process.env.IG_TOKEN;
  const handle = process.env.INSTAGRAM_HANDLE || '';
  const limit = 12;
  if (!userId || !token) return { statusCode: 500, body: 'Missing config' };
  try {
    const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url';
    const api = `https://graph.instagram.com/${userId}/media?fields=${fields}&access_token=${token}&limit=${limit}`;
    const res = await fetch(api);
    if (!res.ok) return { statusCode: 502, body: 'Upstream error' };
    const data = await res.json();
    const posts = (data.data || []).map(m => ({
      id: m.id,
      image: m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url,
      url: m.permalink,
    }));
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=60' },
      body: JSON.stringify({ profile: `https://instagram.com/${handle}`, posts })
    };
  } catch (e) {
    return { statusCode: 500, body: 'Error' };
  }
};

