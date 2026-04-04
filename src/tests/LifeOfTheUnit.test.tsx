import { render, screen } from "@testing-library/react";
import { LifeOfTheUnit } from "@/components/life-of-the-unit";
import { contentService } from "@/lib/content/content.service";

jest.mock("@/lib/content/content.service", () => ({
  contentService: {
    get: jest.fn(),
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("LifeOfTheUnit Component", () => {
  const mockLocale = "uk";

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should render skeleton when image is empty string", async () => {
    const mockContent = {
      mainTitle: "ЖИТТЯ КОРПУСУ",
      items: [
        { title: "НАВЧАННЯ", image: "", alt: "test" }, 
      ],
    };

    (contentService.get as jest.Mock).mockResolvedValue(mockContent);

    const Result = await LifeOfTheUnit({ locale: mockLocale });

    const { container } = render(Result!);

    expect(screen.getByText("ЖИТТЯ КОРПУСУ")).toBeInTheDocument();

    const image = screen.queryByRole("img");

    expect(image).not.toBeInTheDocument();

    const skeleton = container.querySelector('.animate-pulse');

    expect(skeleton).toBeInTheDocument();
    
    expect(screen.getByText("НАВЧАННЯ")).toBeInTheDocument();
  });

  it("should render real image when URL is provided", async () => {
    const mockContent = {
      mainTitle: "ЖИТТЯ КОРПУСУ",
      items: [
        { title: "МОТИВАЦІЯ", image: "https://test.com/img.jpg", alt: "motivation" },
      ],
    };

    (contentService.get as jest.Mock).mockResolvedValue(mockContent);

    const Result = await LifeOfTheUnit({ locale: mockLocale });

    render(Result!);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("src", "https://test.com/img.jpg");
    expect(screen.getByText("МОТИВАЦІЯ")).toBeInTheDocument();
  });

  it("should return null if locale is invalid", async () => {
    const Result = await LifeOfTheUnit({ locale: "invalid.locale" });
    
    expect(Result).toBeNull();
  });
});