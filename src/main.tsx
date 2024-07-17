import * as React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { google_auth } from "./constants/developments";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container!);



const rootElement = document.getElementById("root");
if (rootElement) {
  root.render(
    <BrowserRouter>
      {/* <React.StrictMode> */}
        <GoogleOAuthProvider clientId={google_auth.client_id}>
          <App />
        </GoogleOAuthProvider>
      {/* </React.StrictMode> */}
    </BrowserRouter>
  )
}
