import { render, screen } from "@testing-library/react";

import { Subdivision } from "@/types";
import { SubdivisionCard } from "@/components/subdivisions/subdivision-card";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, string>) => {
    const translations: Record<string, string> = {
      visitSite: "Наш сайт",
      imageAlt: params?.name ?? "",
      hoverImageAlt: params?.name ?? "",
    };

    return translations[key] ?? key;
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
}));

const mockSubdivision: Subdivision = {
  id: "1",
  name: "157 БРИГАДА",
  slug: "157-omvr",
  description: "157-ма окрема механізована бригада. Бригада сформована у 2024 році.",
  siteUrl: "https://157ombr.army/",
  imageUrl: "/images/subdivisions/157-omvr.webp",
  hoverImageUrl: "/images/subdivisions/hover-image.webp",
  hoverName: "157 окрема механізована бригада",
  hoverDescription: "Повний опис 157 бригади для hover стану.",
  isActive: true,
  sortOrder: 10,
  languageCode: "uk",
  languageId: "uuid-language-uk",
};

describe("SubdivisionCard", () => {
  it("should render both default and hover content in the DOM", () => {
    render(<SubdivisionCard subdivision={mockSubdivision} />);

    expect(screen.getByText("157 БРИГАДА")).toBeInTheDocument();
    expect(screen.getByText("157 окрема механізована бригада")).toBeInTheDocument();

    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(2);
  });

  it("should have correct Tailwind classes for CSS hover transition", () => {
    render(<SubdivisionCard subdivision={mockSubdivision} />);
    expect(screen.getByRole("article")).toHaveClass("group");
  });

  it("should format description correctly using whitespace-pre-line", () => {
    render(<SubdivisionCard subdivision={mockSubdivision} />);

    const expectedText = "157-ма окрема механізована бригада.\nБригада сформована у 2024 році.";

    const descriptionElement = screen.getByText(expectedText, {
      normalizer: (s) => s, // Вимикаємо стандартну нормалізацію пробілів
    });

    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass("whitespace-pre-line");
  });

  it("should render site link and check its attributes", () => {
    render(<SubdivisionCard subdivision={mockSubdivision} />);
    const link = screen.getByRole("link", { name: "Наш сайт" });

    expect(link).toHaveAttribute("href", "https://157ombr.army/");
  });

  it("should render visitSite as span when siteUrl is missing", () => {
    const subdivisionWithoutSite = { ...mockSubdivision, siteUrl: null };

    render(<SubdivisionCard subdivision={subdivisionWithoutSite} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Наш сайт").tagName).toBe("SPAN");
  });

  it("should fallback to name when hoverName is null", () => {
    const subdivisionWithoutHoverName = { ...mockSubdivision, hoverName: null };

    render(<SubdivisionCard subdivision={subdivisionWithoutHoverName} />);
    const titles = screen.getAllByText("157 БРИГАДА");

    expect(titles.length).toBe(2);
  });

  it("should fallback to description when hoverDescription is null", () => {
    const subdivisionWithoutHoverDesc = { ...mockSubdivision, hoverDescription: null };

    render(<SubdivisionCard subdivision={subdivisionWithoutHoverDesc} />);

    const expectedText = "157-ма окрема механізована бригада.\nБригада сформована у 2024 році.";

    const descriptions = screen.getAllByText(expectedText, {
      normalizer: (s) => s,
    });

    expect(descriptions.length).toBe(2);
  });
});
