import { Platform } from "@canmingir/link";
import React from "react";
import ReactDOM from "react-dom/client";
import routes from "../routes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Platform routes={routes} />
  </React.StrictMode>
);
