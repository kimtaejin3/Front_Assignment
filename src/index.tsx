import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import DragDataContext from "./dragContext/DragDataContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <DragDataContext>
    <App />
  </DragDataContext>
);
