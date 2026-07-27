import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve, dirname } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const codeCheckerApiPkg = JSON.parse(
  readFileSync(
    resolve(__dirname, "node_modules/codechecker-api/package.json"),
    "utf-8"
  )
);
const apiVersion = codeCheckerApiPkg.version
  .split(".")
  .slice(0, 2)
  .join(".");

const CC_SERVICE_ENDPOINTS = [
  "Authentication",
  "Configuration",
  "CodeCheckerService",
  "Products",
  "ServerInfo"
];

const CC_THRIFT_API_HOST =
  process.env.CC_THRIFT_API_HOST || "http://localhost";
const CC_THRIFT_API_PORT = process.env.CC_THRIFT_API_PORT || 8002;

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    nodePolyfills({
      include: [ "buffer", "util" ]
    })
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@statistics": resolve(__dirname, "src/components/Statistics"),
      "@cc-api": resolve(__dirname, "src/services/api"),

      "@cc/auth": "codechecker-api/lib/codeCheckerAuthentication.js",
      "@cc/auth-types": "codechecker-api/lib/authentication_types.js",
      "@cc/conf": "codechecker-api/lib/configurationService.js",
      "@cc/conf-types": "codechecker-api/lib/configuration_types.js",
      "@cc/db-access": "codechecker-api/lib/codeCheckerDBAccess.js",
      "@cc/prod": "codechecker-api/lib/codeCheckerProductService.js",
      "@cc/prod-types": "codechecker-api/lib/products_types.js",
      "@cc/server-info": "codechecker-api/lib/serverInfoService.js",
      "@cc/report-server-types":
        "codechecker-api/lib/report_server_types.js",
      "@cc/shared-types":
        "codechecker-api/lib/codechecker_api_shared_types.js",

      "thrift": resolve(
        __dirname, "node_modules/thrift/lib/nodejs/lib/thrift/browser.js"
      )
    },
    extensions: [ ".js", ".vue", ".json" ]
  },

  define: {
    "__CC_API_VERSION__": JSON.stringify(apiVersion),
    "__CC_SERVER_HOST__": JSON.stringify(
      process.env.CC_SERVER_HOST || null
    ),
    "__CC_SERVER_PORT__": JSON.stringify(
      process.env.CC_SERVER_PORT || null
    ),
    "__VUE_OPTIONS_API__": false,
    "__VUE_PROD_DEVTOOLS__": false,
    "__VUE_PROD_HYDRATION_MISMATCH_DETAILS__": false
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@use \"@/variables.scss\";",
        api: "modern-compiler",
        quietDeps: true,
        silenceDeprecations: [
          "legacy-js-api",
          "import",
          "color-functions",
          "global-builtin"
        ]
      },
      sass: {
        additionalData: "@use \"@/variables.scss\"\n",
        api: "modern-compiler",
        quietDeps: true,
        silenceDeprecations: [
          "legacy-js-api",
          "import",
          "color-functions",
          "global-builtin"
        ]
      }
    }
  },

  optimizeDeps: {
    entries: [ "src/**/*.{js,vue}", "index.html" ],
    include: [
      "vuetify",
      "vuetify/directives",
      "vuetify/components",
      "codechecker-api/lib/codeCheckerAuthentication.js",
      "codechecker-api/lib/authentication_types.js",
      "codechecker-api/lib/configurationService.js",
      "codechecker-api/lib/configuration_types.js",
      "codechecker-api/lib/codeCheckerDBAccess.js",
      "codechecker-api/lib/codeCheckerProductService.js",
      "codechecker-api/lib/products_types.js",
      "codechecker-api/lib/serverInfoService.js",
      "codechecker-api/lib/report_server_types.js",
      "codechecker-api/lib/codechecker_api_shared_types.js"
    ]
  },

  server: {
    port: 8080,
    proxy: {
      [`^/(.*/)?(v[\\d.]+/(${CC_SERVICE_ENDPOINTS.join("|")}))`]: {
        target: `${CC_THRIFT_API_HOST}:${CC_THRIFT_API_PORT}`,
        changeOrigin: true,
        secure: false
      },
      "/docs": {
        target: `${CC_THRIFT_API_HOST}:${CC_THRIFT_API_PORT}`,
        changeOrigin: true,
        secure: false
      }
    }
  },

  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/vuetify")) {
            return "vuetify";
          }
          if (id.includes("node_modules/vue/") ||
              id.includes("node_modules/vue-router/") ||
              id.includes("node_modules/vuex/")) {
            return "vendor";
          }
        }
      }
    }
  },

  test: {
    globals: true,
    environment: "happy-dom",
    include: [ "src/**/*.{test,spec}.{js,ts}" ]
  }
});
