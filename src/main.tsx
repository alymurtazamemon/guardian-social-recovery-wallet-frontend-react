import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <App />
            </NotificationProvider>
        </MoralisProvider>
    </React.StrictMode>
);
