import { render, screen } from "@testing-library/react";

import { SECTION_KEYS } from "@/constants/section-key";
import { LifeOfTheCorpsSection } from "@/components/sections/life-of-the-corps-section";
import { contentService } from "@/lib/content/content.service";

jest.mock("@/lib/content/content.service", () => ({
  contentService: {
    get: jest.fn(),
  },
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={typeof src === "string" ? src : src?.src} alt={alt} {...props} />,
}));

jest.mock("@/components/sections/life-of-the-corps-section/gallery/gallery-client", () => ({
  LifeOfTheCorpsGalleryClient: ({ cells, images }: any) => (
    <div>
      <div data-testid="cells">{JSON.stringify(cells)}</div>
      <div data-testid="images">{JSON.stringify(images)}</div>
      {cells.map((cell: any) => (
        <div key={cell.id}>
          {cell.text && <span>{cell.text}</span>}
          {cell.src && <img src={cell.src} alt={cell.id} />}
        </div>
      ))}
    </div>
  ),
}));

const MOCK_LOCALE = "uk";
const MAIN_TITLE = "ЖИТТЯ КОРПУСУ";
const SECTION_DESCRIPTION = "Опис секції";
const TRAINING_IMAGE_URL = "https://test.com/training.jpg";

const TRAINING_GALLERY_ITEM = {
  text: "НАВЧАННЯ",
  secureUrl: TRAINING_IMAGE_URL,
  publicId: "training",
  mediaType: "image" as const,
  videoUrl: "",
};

const EMPTY_GALLERY_ITEM = {
  text: "БЕЗ ФОТО",
  secureUrl: "",
  publicId: "",
  mediaType: "image" as const,
  videoUrl: "",
};

const VIDEO_GALLERY_ITEM = {
  text: "ВІДЕО",
  secureUrl: "",
  publicId: "",
  mediaType: "video" as const,
  videoUrl: "https://youtu.be/abc123",
};

const mockAboutContent = (gallery: any[]) => ({
  mainTitle: MAIN_TITLE,
  description: SECTION_DESCRIPTION,
  content: { gallery },
});

describe("LifeOfTheCorpsSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render gallery cells from content", async () => {
    (contentService.get as jest.Mock).mockResolvedValue(mockAboutContent([TRAINING_GALLERY_ITEM]));

    const Result = await LifeOfTheCorpsSection({ locale: MOCK_LOCALE });

    render(Result!);

    expect(contentService.get).toHaveBeenCalledWith({
      locale: MOCK_LOCALE,
      schema: expect.anything(),
      section: SECTION_KEYS.ABOUT,
    });
    expect(screen.getByText("НАВЧАННЯ")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "img-0" })).toHaveAttribute("src", TRAINING_IMAGE_URL);
  });

  it("should pass only image items with secureUrl to images when mediaType is image", async () => {
    (contentService.get as jest.Mock).mockResolvedValue(
      mockAboutContent([TRAINING_GALLERY_ITEM, EMPTY_GALLERY_ITEM]),
    );

    const Result = await LifeOfTheCorpsSection({ locale: MOCK_LOCALE });

    render(Result!);

    const images = JSON.parse(screen.getByTestId("images").textContent ?? "[]");

    expect(images).toEqual([
      {
        text: "НАВЧАННЯ",
        id: "gallery-media-0",
        src: TRAINING_IMAGE_URL,
        videoUrl: "",
      },
    ]);
  });

  it("should pass video items to images when mediaType is video", async () => {
    (contentService.get as jest.Mock).mockResolvedValue(
      mockAboutContent([VIDEO_GALLERY_ITEM]),
    );

    const Result = await LifeOfTheCorpsSection({ locale: MOCK_LOCALE });

    render(Result!);

    const images = JSON.parse(screen.getByTestId("images").textContent ?? "[]");

    expect(images).toEqual([
      {
        text: "ВІДЕО",
        id: "gallery-media-0",
        src: "",
        videoUrl: "https://youtu.be/abc123",
      },
    ]);
  });

  it("should return null when content is missing", async () => {
    (contentService.get as jest.Mock).mockResolvedValue(null);

    const Result = await LifeOfTheCorpsSection({ locale: MOCK_LOCALE });

    expect(Result).toBeNull();
  });

  it("should return null when content loading fails", async () => {
    (contentService.get as jest.Mock).mockRejectedValue(new Error("Invalid locale"));

    const Result = await LifeOfTheCorpsSection({ locale: "invalid.locale" as any });

    expect(Result).toBeNull();
  });
});