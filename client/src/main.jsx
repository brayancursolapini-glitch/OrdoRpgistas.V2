import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { AudioProvider } from "./context/AudioContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <UserProvider>
            <ThemeProvider>
                <AudioProvider>
                    <App />
                </AudioProvider>
            </ThemeProvider>
        </UserProvider>
    </React.StrictMode>
);
