import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeContextProvider } from "./context/Theme.context.jsx";
import UserContextProvider from "./context/User.context.jsx";
import { SocketContextProvider } from "./context/Socket.context.jsx";

createRoot(document.getElementById("root")).render(
  <SocketContextProvider>
    <UserContextProvider>
      <ThemeContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContextProvider>
    </UserContextProvider>
  </SocketContextProvider>
);
