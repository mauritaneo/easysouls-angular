const { registerPlugin } = require('@scullyio/scully');
const { ApolloClient, InMemoryCache } = require('@apollo/client/core');
const gql = require('graphql-tag');
const fetch = require('node-fetch');
const { HandledRoute } = require('@scullyio/scully');

export const PagesAndPostsPlugin = 'pagesAndPostsPlugin';

export function pagesAndPostsPlugin(): Promise<typeof HandledRoute[]> {
  return new Promise(async (resolve, reject) => {
    const client = new ApolloClient({
      uri: 'https://1ac0-82-53-138-169.ngrok-free.app/easysouls/graphql',
      cache: new InMemoryCache(),
      fetch: fetch,
    });

    const query = gql`
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
      const result = await client.query({ query });

      const pages = result.data.pages.nodes;
      const pageRoutes: typeof HandledRoute[] = pages.map(page => ({
        route: `/page${page.uri}`,
        type: 'page',
        data: {
          title: page.title,
          content: page.content,
        },
      }));

      const posts = result.data.posts.nodes;
      const postRoutes: typeof HandledRoute[] = posts.map((post: any) => ({
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

      const handledRoutes: typeof HandledRoute[] = [
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
    } catch (error) {
      console.error('Error fetching data:', error);
      reject(error);
    }
  });
}

registerPlugin('router', PagesAndPostsPlugin, pagesAndPostsPlugin);