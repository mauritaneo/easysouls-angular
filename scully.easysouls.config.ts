
import { ScullyConfig } from '@scullyio/scully';
import { PagesAndPostsPlugin } from './plugins/pagesAndPostPlugin.js';
import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite';
import '@scullyio/scully-plugin-puppeteer';

// Promise error handling
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

export const config: ScullyConfig = {
  projectRoot: './',
  projectName: 'easysouls',
  distFolder: './dist/easysouls',
  outDir: './dist/static',
  extraRoutes: ['/page/:path', '/post/:path'],
  puppeteerLaunchOptions: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  defaultPostRenderers: [baseHrefRewrite],
  routes: {
    '/': {
      type: 'default',
    },
    '/page/:path': {
      type: PagesAndPostsPlugin,
      postRenderers: [baseHrefRewrite],
      baseHref: '../../',
    },
    '/post/:path': {
      type: PagesAndPostsPlugin,
      postRenderers: [baseHrefRewrite],
      baseHref: '../../',
    },
    '/shared': {
      type: PagesAndPostsPlugin,
      postRenderers: [baseHrefRewrite],
      baseHref: '../../',
    },
    '/404': {
      type: 'default',
      baseHref: '../',
      postRenderers: [baseHrefRewrite],
    },
  }
};
