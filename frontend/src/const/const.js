import React from "react";
import { Reports, History, Main, Account } from "../pages/index";

export const ROUTES = {
  MAIN: "/",
  REPORTS: "/reports",
  HISTORY: "/history",
  ACCOUNT: "/account",
};
export const MAIN_HEADER_MENU = [
  { name: "Мониторинг", path: ROUTES.MAIN, element: <Main /> },
  { name: "Отчёты", path: ROUTES.REPORTS, element: <Reports /> },
  { name: "Мои действия", path: ROUTES.HISTORY, element: <History /> },
  { name: "", path: ROUTES.ACCOUNT, element: <Account /> },
];
