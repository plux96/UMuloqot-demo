import { EuiProvider, EuiThemeProvider, EuiThemeColorMode } from "@elastic/eui";

import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hook";
import ThemeSelector from "./components/ThemeSelector";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector((data) => data.auth.isDarkTheme);
  const [theme, setTheme] = useState<EuiThemeColorMode>("light");
  const [isInitialTheme, setIsInitialTheme] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("u-theme");
    if (theme) {
      setTheme(theme as EuiThemeColorMode);
    } else {
      localStorage.setItem("u-theme", "light");
    }
  }, []);

  useEffect(() => {
    if (isInitialTheme) setIsInitialTheme(false);
    else {
      window.location.reload();
    }
  }, [isDarkTheme]);

  const overrides = {
    colors: {
      LIGHT: { primary: "#0b5cff" },
      DARK: { primary: "#0b5cff" },
    },
  };
  return (
    <ThemeSelector>
      <EuiProvider colorMode={theme}>
        <EuiThemeProvider modify={overrides}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </EuiThemeProvider>
      </EuiProvider>
    </ThemeSelector>
  );
}

export default App;
