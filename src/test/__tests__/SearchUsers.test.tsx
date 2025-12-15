import type { FormEvent, ReactElement } from "react";
import { ThemeProvider } from "@emotion/react";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchUsers from "components/SearchUsers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
};

const renderWithTheme = (ui: ReactElement) => {
  return render(<ThemeProvider theme={mockTheme}>{ui}</ThemeProvider>);
};

const dummyHandleChangeQuery = () => {};
const dummyHandleSearch = vi.fn((e: FormEvent) => e.preventDefault());

class FakeQueryTracker {
  private queries: string[] = [];

  trackQuery(query: string) {
    this.queries.push(query);
  }

  getLastQuery() {
    return this.queries[this.queries.length - 1];
  }

  getAllQueries() {
    return [...this.queries];
  }

  clear() {
    this.queries = [];
  }
}

describe("SearchUsers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("1. Dummy: рендерит компонент с dummy функциями", async () => {
    renderWithTheme(
      <SearchUsers
        handleChangeQuery={dummyHandleChangeQuery}
        handleSearch={dummyHandleSearch}
        searchQuery=""
      />
    );
    const input = screen.getByPlaceholderText("Поиск пользователей GitHub...");

    expect(input).toBeInTheDocument();

    expect(screen.getByText("Поиск")).toBeInTheDocument();
  });

  it("2. Stub: показывает задержку при вводе", async () => {
    const stubHandleChangeQuery = vi.fn();

    renderWithTheme(
      <SearchUsers
        handleChangeQuery={stubHandleChangeQuery}
        handleSearch={dummyHandleSearch}
        searchQuery=""
      />
    );

    const input = screen.getByPlaceholderText("Поиск пользователей GitHub...");

    fireEvent.change(input, { target: { value: "test" } });

    expect(stubHandleChangeQuery).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(stubHandleChangeQuery).toHaveBeenCalledWith("test");
  });

  it("3. Spy: отслеживает вызовы handleChangeQuery с debounce", async () => {
    const spyHandleChangeQuery = vi.fn();

    renderWithTheme(
      <SearchUsers
        handleChangeQuery={spyHandleChangeQuery}
        handleSearch={dummyHandleSearch}
        searchQuery=""
      />
    );

    const input = screen.getByPlaceholderText("Поиск пользователей GitHub...");

    fireEvent.change(input, { target: { value: "react" } });

    expect(spyHandleChangeQuery).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(spyHandleChangeQuery).toHaveBeenCalledWith("react");
    expect(spyHandleChangeQuery).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: "vue" } });

    vi.advanceTimersByTime(200);

    fireEvent.change(input, { target: { value: "vuejs" } });

    vi.advanceTimersByTime(300);

    expect(spyHandleChangeQuery).toHaveBeenCalledWith("vuejs");
    expect(spyHandleChangeQuery).toHaveBeenCalledTimes(2);
  });

  it("4. Fake: корректно взаимодействует с FakeQueryTracker", () => {
    const fakeTracker = new FakeQueryTracker();

    renderWithTheme(
      <SearchUsers
        handleChangeQuery={(query) => fakeTracker.trackQuery(query)}
        handleSearch={dummyHandleSearch}
        searchQuery=""
      />
    );

    const input = screen.getByPlaceholderText("Поиск пользователей GitHub...");

    fireEvent.change(input, { target: { value: "angular" } });
    vi.advanceTimersByTime(300);

    expect(fakeTracker.getLastQuery()).toBe("angular");
    expect(fakeTracker.getAllQueries()).toEqual(["angular"]);

    fireEvent.change(input, { target: { value: "svelte" } });
    vi.advanceTimersByTime(300);

    expect(fakeTracker.getLastQuery()).toBe("svelte");
    expect(fakeTracker.getAllQueries()).toEqual(["angular", "svelte"]);
  });

  it("5. Mock: проверяет mock функцию с возвратом конкретного ответа", async () => {
    const mockApiResponse = {
      success: true,
      message: "Поиск выполнен успешно",
      results: 5,
      data: ["user1", "user2", "user3"],
    };
    const mockHandleSearch = vi.fn().mockResolvedValue(mockApiResponse);
    const mockHandleChangeQuery = vi.fn();

    renderWithTheme(
      <SearchUsers
        handleChangeQuery={mockHandleChangeQuery}
        handleSearch={mockHandleSearch}
        searchQuery=""
      />
    );

    const input = screen.getByPlaceholderText("Поиск пользователей GitHub...");
    const searchButton = screen.getByText("Поиск");

    fireEvent.change(input, { target: { value: "javascript" } });

    vi.advanceTimersByTime(300);
    expect(mockHandleChangeQuery).toHaveBeenCalledWith("javascript");

    fireEvent.click(searchButton);

    expect(mockHandleSearch).toHaveBeenCalledTimes(1);

    const resultPromise = mockHandleSearch.mock.results[0].value;
    const result = await resultPromise;

    expect(result).toEqual(mockApiResponse);
    expect(result.success).toBe(true);
    expect(result.results).toBe(5);
  });
});
