import { render, screen, fireEvent } from "@testing-library/react";
import { SubdivisionCard } from "@/components/subdivisions/subdivision-card";
import { Subdivision } from "@/types";

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
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
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
  it("should render emblem image and short name by default", () => {
    render(<SubdivisionCard subdivision={mockSubdivision} />);

    const emblem = screen.getByAltText("157 БРИГАДА");

    expect(emblem).toBeInTheDocument();
    expect(emblem).toHaveAttribute("src", "/images/subdivisions/157-omvr.webp");
    expect(screen.getByText("157 БРИГАДА")).toBeInTheDocument();
  });

  it("should not render hover content by default", () => {
    render(<SubdivisionCard subdivision={mockSubdivision} />);

    expect(screen.queryByText("157 окрема механізована бригада")).not.toBeInTheDocument();
    expect(screen.queryByText("Повний опис 157 бригади для hover стану.")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("should show hover content on mouse enter", () => {
    render(<SubdivisionCard subdivision={mockSubdivision} />);

    fireEvent.mouseEnter(screen.getByRole("article"));

    expect(screen.getByText("157 окрема механізована бригада")).toBeInTheDocument();
    expect(screen.getByText("Повний опис 157 бригади для hover стану.")).toBeInTheDocument();
    expect(screen.getByAltText("157 окрема механізована бригада")).toHaveAttribute(
      "src",
      "/images/subdivisions/hover-image.webp"
    );
  });

  it("should show site link on hover when siteUrl is provided", () => {
    render(<SubdivisionCard subdivision={mockSubdivision} />);

    fireEvent.mouseEnter(screen.getByRole("article"));

    const link = screen.getByRole("link", { name: "Наш сайт" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://157ombr.army/");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("should hide hover content on mouse leave", () => {
    render(<SubdivisionCard subdivision={mockSubdivision} />);

    const article = screen.getByRole("article");
    fireEvent.mouseEnter(article);
    fireEvent.mouseLeave(article);

    expect(screen.queryByText("157 окрема механізована бригада")).not.toBeInTheDocument();
    expect(screen.getByText("157 БРИГАДА")).toBeInTheDocument();
  });

  it("should render visitSite as plain text placeholder when siteUrl is null", () => {
    const subdivisionWithoutSite: Subdivision = {
      ...mockSubdivision,
      siteUrl: null,
    };

    render(<SubdivisionCard subdivision={subdivisionWithoutSite} />);

    fireEvent.mouseEnter(screen.getByRole("article"));

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Наш сайт")).toBeInTheDocument();
  });

  it("should fallback to name when hoverName is null", () => {
    const subdivisionWithoutHoverName: Subdivision = {
      ...mockSubdivision,
      hoverName: null,
    };

    render(<SubdivisionCard subdivision={subdivisionWithoutHoverName} />);

    fireEvent.mouseEnter(screen.getByRole("article"));

    expect(screen.getAllByText("157 БРИГАДА")).toHaveLength(1);
  });

  it("should fallback to description when hoverDescription is null", () => {
    const subdivisionWithoutHoverDesc: Subdivision = {
      ...mockSubdivision,
      hoverDescription: null,
    };

    render(<SubdivisionCard subdivision={subdivisionWithoutHoverDesc} />);

    fireEvent.mouseEnter(screen.getByRole("article"));

    expect(
      screen.getByText("157-ма окрема механізована бригада. Бригада сформована у 2024 році.")
    ).toBeInTheDocument();
  });
});