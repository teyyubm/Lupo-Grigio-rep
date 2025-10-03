// Configuration for live Instagram fetching.
// If you deploy a serverless proxy that returns recent media for your account,
// set INSTAGRAM_PROXY_URL to its endpoint. Leave empty to use local JSON fallback.
// Examples:
//  - Cloudflare Workers: https://<your-worker>.<subdomain>.workers.dev
//  - Netlify Functions:  /.netlify/functions/instagram
export const INSTAGRAM_PROXY_URL = '/.netlify/functions/instagram';

// Expected proxy response shape:
// { profile: 'https://instagram.com/yourhandle', posts: [{ id, image, url }] }

