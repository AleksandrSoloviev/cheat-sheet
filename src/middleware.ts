import { defineMiddleware } from 'astro:middleware';
import { isLocale } from './i18n/ui';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;
  if (pathname.startsWith('/_') || pathname.includes('.')) {
    return next();
  }

  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment) {
    return context.redirect('/ru/');
  }
  if (segment === '404') {
    return next();
  }
  if (!isLocale(segment)) {
    const rest = pathname.replace(/^\/[^/]+/, '') || '/';
    return context.redirect(`/ru${rest.startsWith('/') ? rest : `/${rest}`}`);
  }
  return next();
});
