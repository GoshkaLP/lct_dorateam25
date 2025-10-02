import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import {
  DataProvider,
  useData,
} from "../Filters/components/DataContext/DataContext";
import Header from "../Header/Header";
import { MAIN_HEADER_MENU } from "../../const/const";
import { AuthPage } from "../../pages";
import { useUserProfile } from "../../store/UserProfile";

function AppContent() {
  const { isAuth } = useUserProfile();

  return (
    <div className="app">
      {!isAuth ? <Navigate to="/auth" replace /> : <Header />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        {MAIN_HEADER_MENU.map((item) => (
          <Route key={item.path} path={item.path} element={item.element} />
        ))}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
