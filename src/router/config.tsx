/*
 * @Description: 路由配置
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\router\config.tsx
 */
import { lazy, Suspense, ReactNode } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Spin } from "antd";
import AppLayout from "@/layout";
import styles from "./index.less";

const Home = lazy(() => import("@/view/home"));
const AboutMe = lazy(() => import("@/view/about"));
const Detail = lazy(() => import("@/view/detail"));
const Login = lazy(() => import("@/view/login"));
const Mackdown = lazy(() => import("@/view/mackdown"));
const Classify = lazy(() => import("@/view/classify"));
const Timeline = lazy(() => import("@/view/timeline"));
const Tag = lazy(() => import("@/view/tag"));

const lazyLoad = (children: ReactNode, needSpin = true): ReactNode => {
  return (
    <Suspense fallback={needSpin ? <Spin className={styles.loading} /> : null}>
      {children}
    </Suspense>
  );
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />, // 指定路由渲染容器
    children: [
      {
        path: "home",
        element: lazyLoad(<Home />),
      },
      {
        path: "classify",
        element: lazyLoad(<Classify />),
      },
      {
        path: "tag",
        element: lazyLoad(<Tag />),
      },
      {
        path: "timeline",
        element: lazyLoad(<Timeline />),
      },
      {
        path: "about",
        element: lazyLoad(<AboutMe />),
      },
      {
        path: "create",
        element: lazyLoad(<Mackdown />),
      },
      {
        path: "home/detail/:id",
        element: lazyLoad(<Detail />),
      },
    ],
  },
  {
    path: "detail/:id",
    element: lazyLoad(<Detail />),
  },
  {
    path: "login",
    element: lazyLoad(<Login />),
  },
  {
    path: "*",
    element: <Navigate to="/" />, // 路由重定向
  },
];

export default routes;
