import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import './index.css'
import "@mantine/core/styles.css";
import {
  MantineProvider,
  createTheme,
  MantineColorsTuple,
} from "@mantine/core";

const myColor: MantineColorsTuple = [
  "#ffebeb",
  "#fad4d5",
  "#f3a6a9",
  "#ed7578",
  "#e84d50",
  "#e63436",
  "#e52729",
  "#cc1b1d",
  "#b61419",
  "#a00612",
];

const theme = createTheme({
  colors: {
    myColor,
  },
  fontFamily: '"Lalezar", system-ui',
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: { fontFamily: '"Lalezar", system-ui' },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
