import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import route from "./route/route.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";

const router = createBrowserRouter(route);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);