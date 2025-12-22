import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { render, screen } from "@testing-library/react";
import Header from "components/Header";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockTheme = {
  colors: {
    primary: "#272626",
    secondary: "#404441",
    danger: "#ff0000",
    success: "#4caf50",
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    white: "#fff",
    black: "#000",
  },
  fontFamilies: {
    primary: '"Inter", sans-serif',
    secondary: '"Georgia", serif',
    monospace: '"Fira Code", monospace',
  },
  fontSizes: {
    xxs: 14,
    xs: 18,
    sd: 20,
    sm: 24,
    md: 28,
    lg: 32,
  },
  spaces: {
    xxs: 5,
    sm: 20,
    md: 40,
    lg: 80,
    xl: 100,
    xxl: 200,
    xxxl: 300,
  },
  containers: {
    md: 1200,
    lg: 1400,
  },
};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, onClick, ...props }: any) => (
    <a href={to} onClick={onClick} {...props} data-testid={`link-${to.replace("/", "") || "home"}`}>
      {children}
    </a>
  ),
}));

const renderWithTheme = (ui: ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={mockTheme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );
};

describe("Header Component Screenshot Tests", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Desktop View", () => {
    it("рендерит заголовок и навигацию на десктопе", () => {
      const { container } = renderWithTheme(<Header />);

      expect(screen.getByText("Emotion app")).toBeInTheDocument();

      expect(container).toMatchSnapshot();
    });
  });
});
