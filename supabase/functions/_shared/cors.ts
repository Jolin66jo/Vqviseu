const configuredOrigins = [
  ...(Deno.env.get('ALLOWED_ORIGINS') || '').split(','),
  Deno.env.get('APP_URL') || '',
  'http://localhost:5173'
].map((origin) => origin.trim()).filter(Boolean);

export function isAllowedOrigin(origin: string | null): boolean {
  return !origin || configuredOrigins.includes(origin);
}

export function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
