import type { APIRoute } from 'astro';
import { isLocale } from '../../i18n/ui';
import { buildStoryCatalog } from '../../lib/story-catalog';

export const prerender = true;

export function getStaticPaths() {
  return [{ params: { locale: 'ru' } }, { params: { locale: 'en' } }];
}

export const GET: APIRoute = async ({ params }) => {
  if (!isLocale(params.locale)) {
    return new Response('Not found', { status: 404 });
  }
  const catalog = await buildStoryCatalog(params.locale);
  return new Response(JSON.stringify(catalog), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
