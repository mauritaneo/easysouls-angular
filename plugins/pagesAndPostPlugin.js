"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagesAndPostsPlugin = exports.PagesAndPostsPlugin = void 0;
const { registerPlugin } = require('@scullyio/scully');
const { ApolloClient, InMemoryCache } = require('@apollo/client/core');
const gql = require('graphql-tag');
const fetch = require('node-fetch');
const { HandledRoute } = require('@scullyio/scully');
exports.PagesAndPostsPlugin = 'pagesAndPostsPlugin';
function pagesAndPostsPlugin() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const client = new ApolloClient({
            uri: 'http://localhost/easysouls/graphql',
            cache: new InMemoryCache(),
            fetch: fetch,
        });
        const query = gql `
    query {
      pages {
        nodes {
          id
          uri
          title
          content
        }
      }
      posts {
        nodes {
          id
          uri
          title
          excerpt
          content
        }
        pageInfo {
          total
        }
      }
      themeSettings {
        postsPerPage
      }
    
      generalSettings {
        title
        description
        url
        choices
        bannerimage
        sidebarname
        asideentry1: asideentries(index: 0) {
          text
          class
          link
        }
        asideentry2: asideentries(index: 1) {
          text
          class
          link
        }
        asideentry3: asideentries(index: 2) {
          text
          class
          link
        }
        asideentry4: asideentries(index: 3) {
          text
          class
          link
        }
        asideentry5: asideentries(index: 4) {
          text
          class
          link
        }
        asideEntryImageData1: asideEntryImageData(index: 0)
        asideEntryImageData2: asideEntryImageData(index: 1)
        asideEntryImageData3: asideEntryImageData(index: 2)
        asideEntryImageData4: asideEntryImageData(index: 3)
        asideEntryImageData5: asideEntryImageData(index: 4)
      }

      menu(id: "dGVybToz") {
        menuItems {
          nodes {
            id
            label
            url
          }
        }
      }

      footerWidget
      generalSettings {
        url
      }
    }
    `;
        try {
            const result = yield client.query({ query });
            const pages = result.data.pages.nodes;
            const pageRoutes = pages.map(page => ({
                route: `/page${page.uri}`,
                type: 'page',
                data: {
                    title: page.title,
                    content: page.content,
                },
            }));
            const posts = result.data.posts.nodes;
            const postRoutes = posts.map((post) => ({
                route: `/post${post.uri}`,
                type: 'post',
                data: {
                    title: post.title,
                    content: post.content,
                },
            }));
            const generalSettings = result.data.generalSettings;
            const menuItems = result.data.menu.menuItems.nodes;
            const postsPerPage = result.data.themeSettings.postsPerPage;
            const footerWidget = result.data.footerWidget;
            const total = result.data.posts.pageInfo.total;
            const totalPages = Math.ceil(total / postsPerPage);
            const handledRoutes = [
                ...pageRoutes,
                ...postRoutes,
                {
                    route: '/shared',
                    type: 'shared',
                    data: {
                        generalSettings,
                        menuItems,
                        posts,
                        postsPerPage,
                        total,
                        totalPages,
                        footerWidget,
                    },
                },
            ];
            resolve(handledRoutes);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            reject(error);
        }
    }));
}
exports.pagesAndPostsPlugin = pagesAndPostsPlugin;
registerPlugin('router', exports.PagesAndPostsPlugin, pagesAndPostsPlugin);
//# sourceMappingURL=pagesAndPostPlugin.js.map