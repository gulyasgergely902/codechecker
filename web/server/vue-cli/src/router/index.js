import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "products",
      alias: [ "/products.html" ],
      meta: {
        requiresAuth: true
      },
      component: () => import("@/views/Products.vue")
    },
    {
      path: "/login",
      name: "login",
      alias: [ "/login.html" ],
      component: () => import("@/views/Login.vue")
    },
    {
      path: "/login/OAuthLogin/:provider",
      name: "oauthlogin",
      component: () => import("@/views/OAuthLogin.vue")
    },
    {
      path: "/userguide",
      name: "userguide",
      component: () => import("@/views/Userguide.vue"),
    },
    {
      path: "/new-features",
      name: "new-features",
      component: () => import("@/views/NewFeatures.vue")
    },
    {
      path: "/404",
      name: "404",
      component: () => import("@/views/NotFound.vue")
    },
    {
      // Should be kept in sync with the regex from is_valid_product_endpoint
      // on the backend.
      path: "/:endpoint([A-Za-z0-9_-]+)?",
      meta: {
        requiresAuth: true
      },
      component: () => import("@/views/ProductDetail.vue"),
      children: [
        {
          path: "",
          name: "main_runs",
          component: () => import("@/views/RunList.vue")
        },
        {
          path: "runs",
          name: "runs",
          component: () => import("@/views/RunList.vue")
        },
        {
          path: "statistics",
          name: "statistics",
          redirect: { name: "product-overview" },
          component: () => import("@/views/Statistics.vue"),
          children: [
            {
              path: "overview",
              name: "product-overview",
              component: () =>
                import("@statistics/Overview/Overview.vue"),
            },
            {
              path: "checker",
              name: "checker-statistics",
              component: () =>
                import("@statistics/Checker/CheckerStatistics.vue"),
            },
            {
              path: "severity",
              name: "severity-statistics",
              component: () =>
                import("@statistics/Severity/SeverityStatistics.vue"),
            },
            {
              path: "component",
              name: "component-statistics",
              component: () => import(
                "@statistics/Component/ComponentStatistics.vue"),
            },
            {
              path: "coverage",
              name: "checker-coverage-statistics",
              component: () =>
                import(
                  "@statistics/CheckerCoverage/CheckerCoverageStatistics.vue"
                ),
            },
            {
              path: "guideline",
              name: "guideline-statistics",
              component: () => import(
                "@/components/Statistics/Guideline/GuidelineStatistics.vue"
              ),
            },
          ]
        },
        {
          path: "reports",
          name: "reports",
          component: () => import("@/views/Reports.vue")
        },
        {
          path: "report-detail",
          name: "report-detail",
          component: () => import("@/views/ReportDetail.vue")
        },
        {
          path: "cleanup-plan",
          name: "cleanup-plan",
          component: () => import("@/views/CleanupPlan.vue")
        },
        {
          path: "review-status-rules",
          name: "review-status-rules",
          component: () => import("@/views/ReviewStatusRules.vue")
        },
        {
          path: "source-component",
          name: "source-component",
          component: () => import("@/views/SourceComponent.vue")
        },
      ]
    },
    {
      path: "/:unknown(.*)*",
      redirect: "/404"
    }
  ]
});

export default router;
