import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'screens/homePage';
import LandingPage from 'screens/landingPage';
import LoginPage from 'screens/loginPage';
import ProfilePage from 'screens/profilePage';
import SavedPage from 'screens/savedPage';
import MessagePage from 'screens/messagePage';
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/welcome" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/welcome" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/welcome" />}
            />
            <Route
              path="/saved/:userId"
              element={isAuth ? <SavedPage /> : <Navigate to="/welcome" />}
            />
            <Route
              path="/messages/:userId"
              element={isAuth ? <MessagePage /> : <Navigate to="/welcome" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
