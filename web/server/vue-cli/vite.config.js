import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { join, resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import eslint from "vite-plugin-eslint2";
import vuetify from "vite-plugin-vuetify";

const codeCheckerApi = require("codechecker-api/package.json");
const apiVersion = codeCheckerApi.version.split(".").slice(0, 2).join(".");

const root = (...args) => resolve(__dirname, ...args);

const CC_SERVICE_ENDPOINTS = [
  "Authentication",
  "Configuration",
  "CodeCheckerService",
  "Products",
  "ServerInfo",
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const CC_THRIFT_API_HOST = env.CC_THRIFT_API_HOST || "http://localhost";
  const CC_THRIFT_API_PORT = env.CC_THRIFT_API_PORT || "8002";

  const proxyTarget = {
    target: `${CC_THRIFT_API_HOST}:${CC_THRIFT_API_PORT}`,
    changeOrigin: true,
    secure: false,
  };

  const endpoints = CC_SERVICE_ENDPOINTS.join("|");

  return {
    root: root("src"),
    build: {
      outDir: root("dist"),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/vuetify")) return "vuetify";
            if (id.includes("node_modules")) return "vendors";
          },
        },
      },
    },
    resolve: {
      extensions: [ ".js", ".vue" ],
      alias: {
        "@": root("src"),
        "@statistics": root(
          "src", "components", "Statistics"
        ),
        "@cc-api": root(
          "src", "services", "api"
        ),
        "@cc/auth": join(
          "codechecker-api", "lib", "codeCheckerAuthentication.js"
        ),
        "@cc/auth-types": join(
          "codechecker-api", "lib", "authentication_types.js"
        ),
        "@cc/conf": join(
          "codechecker-api", "lib", "configurationService.js"
        ),
        "@cc/conf-types": join(
          "codechecker-api", "lib", "configuration_types.js"
        ),
        "@cc/db-access": join(
          "codechecker-api", "lib", "codeCheckerDBAccess.js"
        ),
        "@cc/prod": join(
          "codechecker-api", "lib", "codeCheckerProductService.js"
        ),
        "@cc/prod-types": join(
          "codechecker-api", "lib", "products_types.js"
        ),
        "@cc/server-info": join(
          "codechecker-api", "lib", "serverInfoService.js"
        ),
        "@cc/report-server-types": join(
          "codechecker-api", "lib", "report_server_types.js"
        ),
        "@cc/shared-types": join(
          "codechecker-api", "lib", "codechecker_api_shared_types.js"
        ),
        "thrift": join(
          "thrift", "lib", "nodejs", "lib", "thrift", "browser.js"
        ),
        "Vuetify": join(
          "vuetify", "lib", "components"
        ),
        "buffer": "buffer/",
        "util": "util/",
      },
    },
    define: {
      "process.env.CC_API_VERSION": JSON.stringify(apiVersion),
      "process.env.CC_SERVER_HOST": JSON.stringify(env.CC_SERVER_HOST || null),
      "process.env.CC_SERVER_PORT": JSON.stringify(env.CC_SERVER_PORT || null),
      "__VUE_OPTIONS_API__": true,
      "__VUE_PROD_DEVTOOLS__": false,
      "__VUE_PROD_HYDRATION_MISMATCH_DETAILS__": false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: "@use \"@/variables.scss\";",
          quietDeps: true,
          silenceDeprecations: [
            "legacy-js-api", "import", "color-functions", "global-builtin",
          ],
        },
        sass: {
          api: "modern-compiler",
          additionalData: "@use \"@/variables.scss\"",
          quietDeps: true,
          silenceDeprecations: [
            "legacy-js-api", "import", "color-functions", "global-builtin",
          ],
        },
      },
    },
    server: {
      port: 8080,
      proxy: {
        [`^/(v[\\d.]+/)?(${endpoints})`]: proxyTarget,
        "/docs": proxyTarget,
      },
    },
    plugins: [
      vue(),
      viteStaticCopy({
        targets: [
          {
            src: root("src", "assets", "userguide", "images"),
            dest: root("dist", "images"),
          },
          {
            src: root("src", "browsersupport.js"),
            dest: root("dist"),
          },
          {
            src: root("src", "static.js"),
            dest: root("dist"),
          },
        ],
      }),
      nodePolyfills({ include: [ "buffer" ] }),
      eslint({ include: [ "src/**/*.{js,vue}" ] }),
      vuetify({ autoImport: true }),
    ],
  };
});
