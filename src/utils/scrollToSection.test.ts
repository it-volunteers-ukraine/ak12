import { scrollToSection } from "@/utils/scrollToSection";
import { logger } from "@/lib/logger/logger";

jest.mock("@/lib/logger/logger", () => ({
  logger: {
    warn: jest.fn(),
  },
}));

jest.mock("@/constants/section-key", () => ({
  sectionIds: ["hero", "about", "contact"],
}));

describe("scrollToSection", () => {
  const scrollToMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "scrollTo", {
      writable: true,
      value: scrollToMock,
    });

    document.body.innerHTML = "";
  });

  it("should log warning if target section does not exist", () => {
    scrollToSection("missing");

    expect(logger.warn).toHaveBeenCalledWith('Section with id "missing" not found in the DOM');
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it("should scroll to the first section", () => {
    document.body.innerHTML = `
      <header></header>
      <section id="hero"></section>
    `;

    Object.defineProperty(document.querySelector("header"), "offsetHeight", {
      configurable: true,
      value: 100,
    });

    Object.defineProperty(document.getElementById("hero")!, "offsetHeight", {
      configurable: true,
      value: 500,
    });

    scrollToSection("hero");

    expect(scrollToMock).toHaveBeenCalledWith({
      top: -100,
      behavior: "smooth",
    });
  });

  it("should calculate scroll position for a later section", () => {
    document.body.innerHTML = `
      <header></header>
      <section id="hero"></section>
      <section id="about"></section>
      <section id="contact"></section>
    `;

    Object.defineProperty(document.querySelector("header"), "offsetHeight", {
      configurable: true,
      value: 100,
    });

    Object.defineProperty(document.getElementById("hero")!, "offsetHeight", {
      configurable: true,
      value: 300,
    });

    Object.defineProperty(document.getElementById("about")!, "offsetHeight", {
      configurable: true,
      value: 400,
    });

    Object.defineProperty(document.getElementById("contact")!, "offsetHeight", {
      configurable: true,
      value: 500,
    });

    scrollToSection("contact");

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 600, // -100 + 300 + 400
      behavior: "smooth",
    });
  });

  it("should use default header height when header is missing", () => {
    document.body.innerHTML = `
      <section id="hero"></section>
    `;

    Object.defineProperty(document.getElementById("hero")!, "offsetHeight", {
      configurable: true,
      value: 500,
    });

    scrollToSection("hero");

    expect(scrollToMock).toHaveBeenCalledWith({
      top: -80,
      behavior: "smooth",
    });
  });

  it("should ignore missing previous sections", () => {
    document.body.innerHTML = `
      <header></header>
      <section id="contact"></section>
    `;

    Object.defineProperty(document.querySelector("header"), "offsetHeight", {
      configurable: true,
      value: 50,
    });

    Object.defineProperty(document.getElementById("contact")!, "offsetHeight", {
      configurable: true,
      value: 500,
    });

    scrollToSection("contact");

    expect(scrollToMock).toHaveBeenCalledWith({
      top: -50,
      behavior: "smooth",
    });
  });
});
