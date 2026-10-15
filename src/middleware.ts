import { defineMiddleware } from 'astro:middleware';
import { isLocale, withBase, withoutBase } from './i18n/ui';

export const onRequest = defineMiddleware((context, next) => {
  const pathname = withoutBase(context.url.pathname);
  if (pathname.startsWith('/_') || pathname.includes('.')) {
    return next();
  }

  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment) {
    return context.redirect(withBase('/ru/'));
  }
  if (segment === '404') {
    return next();
  }
  if (!isLocale(segment)) {
    const rest = pathname.replace(/^\/[^/]+/, '') || '/';
    return context.redirect(withBase(`/ru${rest.startsWith('/') ? rest : `/${rest}`}`));
  }
  return next();
});
