import { createGlobalStyle } from "styled-components";

export const theme = {
  primary: "#c4572a",
  primaryDark: "#9c3f1b",
  text: "#1d2327",
  muted: "#5f6b73",
  background: "#f3ede4",
  surface: "#ffffff",
  danger: "#b3261e",
  dangerBg: "#fde7e7",
  success: "#146c43",
  successBg: "#e3f6ea",
  radius: "0.4rem",
  shadow: "rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px",
};

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    min-height: 100vh;
    background-color: ${({ theme: t }) => t.background};
    color: ${({ theme: t }) => t.text};
    font-family: Newsreader, Georgia, serif;
    -webkit-font-smoothing: antialiased;
  }

  button, input, textarea {
    font: inherit;
  }

  a {
    color: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }
`;
