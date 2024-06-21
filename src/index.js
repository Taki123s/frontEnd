import React from "react";
import ReactDOM from "react-dom/client";

const path = window.location.pathname;
const rootElement = document.getElementById("root");

const renderApp = (App) => {
    ReactDOM.createRoot(rootElement).render(<App />);
};

if (path.startsWith("/admin")) {
    import("./admin/index")
        .then(({ default: AdminApp }) => {
            renderApp(AdminApp);
        })
        .catch((error) => {
            console.error("Error loading admin app:", error);
        });
} else {
    import("./client/index")
        .then(({ default: ClientApp }) => {
            renderApp(ClientApp);
        })
        .catch((error) => {
            console.error("Error loading client app:", error);
        });
}