import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { render } from "@testing-library/react";
import SearchUsers from "components/SearchUsers";
import { describe, expect, it, vi } from "vitest";

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

const renderWithTheme = (ui: ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={mockTheme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );
};

describe("SearchUsers Component Screenshot Tests", () => {
  describe("Base States", () => {
    it("рендерит форму", () => {
      const mockHandleSearch = vi.fn((e) => e.preventDefault());
      const mockHandleChangeQuery = vi.fn();

      const { container } = renderWithTheme(
        <SearchUsers
          handleSearch={mockHandleSearch}
          handleChangeQuery={mockHandleChangeQuery}
          searchQuery=""
        />
      );

      expect(container).toMatchSnapshot();
    });
  });
});
