import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "./useActiveSection"; // Перевір шлях до файлу!

describe("useActiveSection", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1000,
    });

    document.body.innerHTML = `
      <div id="section-1"></div>
      <div id="section-2"></div>
      <div id="section-3"></div>
    `;

    mockBoundingClientRect("section-1", { top: 2000, bottom: 3000 });
    mockBoundingClientRect("section-2", { top: 4000, bottom: 5000 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockBoundingClientRect = (id: string, rect: { top: number; bottom: number }) => {
    const el = document.getElementById(id);

    if (el) {
      el.getBoundingClientRect = jest.fn(() => ({
        top: rect.top,
        bottom: rect.bottom,
        left: 0,
        right: 0,
        width: 100,
        height: rect.bottom - rect.top,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));
    }
  };

  const fireScrollEvent = () => {
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  };

  it("returns empty string initially when no section is in the center", () => {
    const { result } = renderHook(() => useActiveSection(["section-1", "section-2"]));

    expect(result.current).toBe("");
  });

  it("sets active section immediately if it is in the center on mount", () => {
    mockBoundingClientRect("section-1", { top: 100, bottom: 900 });

    const { result } = renderHook(() => useActiveSection(["section-1", "section-2"]));

    expect(result.current).toBe("section-1");
  });

  it("updates active section when scrolling makes an element hit the center", () => {
    const { result } = renderHook(() => useActiveSection(["section-1", "section-2"]));

    expect(result.current).toBe(""); // Спочатку нічого немає в центрі

    mockBoundingClientRect("section-2", { top: 300, bottom: 1200 });
    fireScrollEvent();

    expect(result.current).toBe("section-2");
  });

  it("clears active section when scrolled away from all sections", () => {
    mockBoundingClientRect("section-1", { top: 0, bottom: 1000 });
    const { result } = renderHook(() => useActiveSection(["section-1"]));

    expect(result.current).toBe("section-1");

    mockBoundingClientRect("section-1", { top: -1000, bottom: 0 });
    fireScrollEvent();

    expect(result.current).toBe("");
  });

  it("skips missing elements without throwing errors", () => {
    const { result } = renderHook(() => useActiveSection(["section-missing"]));

    expect(result.current).toBe("");
  });

  it("removes event listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useActiveSection(["section-1"]));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
