import React from "react";
import { Reports, History, Main, Account, Favorite } from "../pages/index";

export const ROUTES = {
  MAIN: "/",
  REPORTS: "/reports",
  HISTORY: "/history",
  ACCOUNT: "/account",
  FAVORITE: "/favorite",
};

export const MAIN_HEADER_MENU = [
  { name: "Анализ территорий", path: ROUTES.MAIN, element: <Main /> },
  { name: "База данных", path: ROUTES.REPORTS, element: <Reports /> },
  { name: "Избранное", path: ROUTES.FAVORITE, element: <Favorite /> },
  { name: "История поиска", path: ROUTES.HISTORY, element: <History /> },
  { name: "", path: ROUTES.ACCOUNT, element: <Account /> },
];
