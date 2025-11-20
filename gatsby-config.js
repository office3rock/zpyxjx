// loading env
const activeEnv = process.env.NODE_ENV || 'development'
console.log(`Using environment config: '${activeEnv}'`)
require("dotenv").config({
  path: `.env.${activeEnv}`,
})

let siteConfig;
let wordpressConfig;

try {
  siteConfig = require(`./siteConfig`);
  wordpressConfig = require(`./.wordpress-config`);
} catch (e) {
  console.log(e);
}

console.log(typeof process.env.WP_HOSTING_WPCOM);
const hostingWPCOM = process.env.WP_HOSTING_WPCOM &&  process.env.WP_HOSTING_WPCOM === "true" ? true: false; 
if (process.env.WP_BASE_URL) {
  wordpressConfig.baseUrl = process.env.WP_BASE_URL; 
  wordpressConfig.protocol = process.env.WP_PROTOCOL ? process.env.WP_PROTOCOL : "https";
  if (hostingWPCOM) {
    wordpressConfig.hostingWPCOM = true;
    wordpressConfig.auth = {};
    wordpressConfig.auth.wpcom_app_clientSecret = process.env.WP_CLI_SEC;
    wordpressConfig.auth.wpcom_app_clientId = process.env.WP_CLI_ID;
    wordpressConfig.auth.wpcom_user = process.env.WP_USER;
    wordpressConfig.auth.wpcom_pass = process.env.WP_PASS;
    wordpressConfig.includedRoutes.push("**/settings");
  }
}

console.log(wordpressConfig);

let gatsbyPlugins = [
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `placeholder`,
      path: `${__dirname}/gatsby-config.js`,
    },
  },
  {
    resolve: `@draftbox-co/gatsby-wordpress-balsa-theme`,
    options: {
      wordpressConfig,
      siteConfig: siteConfig,
    },
  },
  {
    resolve: 'gatsby-plugin-netlify',
    options: {
      headers: {
        '/*': [
          'X-Frame-Options: DENY',
          'X-Content-Type-Options: nosniff',
          'Referrer-Policy: strict-origin-when-cross-origin',
          'Permissions-Policy: geolocation=(), microphone=(), camera=()',
          'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
          'X-XSS-Protection: 1; mode=block',
          "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: http:; font-src 'self' data: https:; connect-src 'self' https:; frame-src https:; object-src 'none'; base-uri 'self';",
        ],
      },
    },
  },
];

if (process.env.SEGMENT_KEY) {
  gatsbyPlugins.push({
    resolve: `gatsby-plugin-segment-js`,
    options: {
      prodKey: process.env.SEGMENT_KEY,
      devKey: process.env.SEGMENT_KEY,
      trackPage: true,
      delayLoad: true,
      delayLoadTime: 1000,
    },
  });
}

if (process.env.GA) {
  gatsbyPlugins.unshift({
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: process.env.GA,
      head: true,
    },
  });
}

if (process.env.GATSBY_MIXPANEL_TOKEN) {
  gatsbyPlugins.push({
    resolve: `gatsby-plugin-mixpanel`,
    options: {
      apiToken: process.env.GATSBY_MIXPANEL_TOKEN,
      enableOnDevMode: true,
      pageViews: 'all'
    },
  });
}

if (process.env.GATSBY_HOTJAR_ID) {
  gatsbyPlugins.push({
    resolve: `@draftbox-co/gatsby-plugin-hotjar-lazy`,
    options: {
      id: process.env.GATSBY_HOTJAR_ID,
      sv: 6,
      optimize: true,
    }
  });
}

if (process.env.GATSBY_GTAG_MANAGER_ID) {
  gatsbyPlugins.unshift({
    resolve: `gatsby-plugin-google-tagmanager`,
    options: {
      id: process.env.GATSBY_GTAG_MANAGER_ID,
      includeInDevelopment: true
    },
  });
}

if (process.env.GATSBY_TAWK_ID) {
  gatsbyPlugins.push({
    resolve: `@draftbox-co/gatsby-plugin-tawk-lazy`,
    options: {
      tawkId: process.env.GATSBY_TAWK_ID,
      optimize: true,
    }
  });
}

if (process.env.GATSBY_CRISP_ID) {
  gatsbyPlugins.push({
    resolve: `@draftbox-co/gatsby-plugin-crisp-chat-lazy`,
    options: {
      websiteId: process.env.GATSBY_CRISP_ID,
      enableDuringDevelop: true,
      optimize: true,
    }
  });
}

if (process.env.GATSBY_OLARK_ID) {
  gatsbyPlugins.push({
    resolve: `@draftbox-co/gatsby-plugin-olark-lazy`,
    options: {
      olarkSiteID: process.env.GATSBY_OLARK_ID,
      optimize: true,
    }
  });
}

module.exports = {
  plugins: gatsbyPlugins,
};
