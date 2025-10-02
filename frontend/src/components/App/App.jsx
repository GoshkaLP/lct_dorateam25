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
import { Snackbar, Alert, IconButton, Box } from "@mui/material";
import { Close as CloseIcon, Warning as WarningIcon } from "@mui/icons-material";

function AppContent() {
  const { isAuth } = useUserProfile();
  const { notification, clearNotification } = useData();
  const location = useLocation();

  return (
    <div className="app">
      {/* Глобальное уведомление о ИТП с оранжевым статусом - не показывать на странице авторизации */}
      {notification && location.pathname !== '/auth' && (
        <Box
          sx={{
            position: 'fixed',
            top: '220px',
            left: '20px',
            zIndex: 9999,
            minWidth: '350px',
            maxWidth: '500px'
          }}
        >
          <Alert
            severity="warning"
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={clearNotification}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            icon={<WarningIcon />}
            sx={{ 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              backgroundColor: 'rgba(240, 176, 162, 0.7)', // #F0B0A2 с opacity 0.7
              '& .MuiAlert-message': {
                fontSize: '14px',
                fontWeight: 500,
                color: '#333'
              },
              '& .MuiAlert-icon': {
                fontSize: '20px',
                color: '#D32F2F'
              },
              '& .MuiAlert-action': {
                color: '#333'
              }
            }}
          >
            {notification.message}
          </Alert>
        </Box>
      )}

      {!isAuth ? <Navigate to="/auth" replace /> : <Header />}
      <Routes>
        <Route key="/auth" path="/auth" element={<AuthPage />} />
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
