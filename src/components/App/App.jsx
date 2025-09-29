import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import { DataProvider } from "../Filters/components/DataContext/DataContext";
import Header from "../Header/Header";
import { MAIN_HEADER_MENU } from "../../const/const";
import { AuthPage } from "../../pages/index";
import { useUserProfile } from "../../store/UserProfile";

function App() {
  const { data, isLoading, isAuth } = useUserProfile();

  // React.useEffect(() => {
  //   // Ваш код при изменении isAuth
  // }, [isAuth]);

  return (
    <DataProvider>
      <div className="app">
        {!isAuth ? <Navigate to="/auth" replace /> : <Header />}
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          {MAIN_HEADER_MENU.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Routes>
      </div>
    </DataProvider>
  );
}

export default App;
