
import { ScullyConfig } from '@scullyio/scully';
import { PagesAndPostsPlugin } from './plugins/pagesAndPostPlugin.js';
import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite';
import { getHttp404Plugin } from './plugins/http404Plugin.js';
import '@scullyio/scully-plugin-puppeteer';

// Promise error handling
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

const Http404Plugin = getHttp404Plugin();

export const config: ScullyConfig = {
  projectRoot: './',
  projectName: 'easysouls',
  distFolder: './dist/easysouls',
  outDir: './dist/static',
  extraRoutes: ['/page/:path', '/post/:path'],
  puppeteerLaunchOptions: { executablePath: '/opt/google/chrome/google-chrome' },
  defaultPostRenderers: [baseHrefRewrite, Http404Plugin],
  routes: {
    '/': {
      type: 'default',
    },
    '/page/:path': {
      type: PagesAndPostsPlugin,
      postRenderers: [baseHrefRewrite, Http404Plugin],
      baseHref: '../../',
    },
    '/post/:path': {
      type: PagesAndPostsPlugin,
      postRenderers: [baseHrefRewrite, Http404Plugin],
      baseHref: '../../',
    },
    '/shared': {
      type: PagesAndPostsPlugin,
      postRenderers: [baseHrefRewrite, Http404Plugin],
      baseHref: '../../',
    },
    /* Test NotFoundComponent
    * '/404': {
    *  type: 'default',
    *  baseHref: '../',
    *
    * },  */
  }
};
