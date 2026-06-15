import { render, screen } from "@testing-library/react";

import { LifeOfTheCorpsSection } from "@/components/sections/life-of-the-corps-section";

jest.mock("@/hooks/useTopFromViewportMinusContent", () => ({
  useTopFromViewportMinusContent: jest.fn(() => 0),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <picture>
      <img src={typeof src === "string" ? src : src?.src} alt={alt} {...props} />
    </picture>
  ),
}));

jest.mock("@/components/sections/life-of-the-corps-section/gallery/gallery-client", () => ({
  LifeOfTheCorpsGalleryClient: ({ cells, images }: any) => (
    <div>
      <div data-testid="cells">{JSON.stringify(cells)}</div>
      <div data-testid="images">{JSON.stringify(images)}</div>
      {cells.map((cell: any) => (
        <div key={cell.id}>
          {cell.text && <span>{cell.text}</span>}
          {cell.src && (
            <picture>
              <img src={cell.src} alt={cell.id} />
            </picture>
          )}
        </div>
      ))}
    </div>
  ),
}));

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

  it("should render gallery cells from content", () => {
    const content = mockAboutContent([TRAINING_GALLERY_ITEM]) as any;

    render(<LifeOfTheCorpsSection content={content} />);

    expect(screen.getByText("НАВЧАННЯ")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "img-0" })).toHaveAttribute("src", TRAINING_IMAGE_URL);
  });

  it("should pass only image items with secureUrl to images when mediaType is image", () => {
    const content = mockAboutContent([TRAINING_GALLERY_ITEM, EMPTY_GALLERY_ITEM]) as any;

    render(<LifeOfTheCorpsSection content={content} />);

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

  it("should pass video items to images when mediaType is video", () => {
    const content = mockAboutContent([VIDEO_GALLERY_ITEM]) as any;

    render(<LifeOfTheCorpsSection content={content} />);

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

  it("should return null when content is missing", () => {
    const { container } = render(<LifeOfTheCorpsSection content={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
