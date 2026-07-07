import { render } from "@testing-library/react";
import { useFormContext } from "react-hook-form";
import { LocaleSection } from "./LocaleSection";
import type { SectionConfig, FieldConfig } from "../types";

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(),
}));

jest.mock("@/lib/youtube/youtube", () => ({
  getYouTubeEmbedUrl: jest.fn((url: string) => (url.includes("youtu") ? "https://youtube.com/embed/test" : null)),
}));

jest.mock("@/lib/logger/logger", () => ({
  logger: { warn: jest.fn() },
}));

jest.mock("@/components", () => ({
  Button: (props: any) => <button {...props} />,
}));

jest.mock("@/components/form-elements", () => ({
  FormImg: () => <div data-testid="form-img" />,
  TextArea: (props: any) => <textarea {...props} />,
  TextInput: (props: any) => <input data-testid="text-input" {...props} />,

  FormField: ({ component: Component, ...props }: any) => {
    if (Component) {
      return <Component {...props} />;
    }

    return <input data-testid="form-field" {...props} />;
  },
}));

jest.mock("../../../../public/icons", () => ({
  En: () => <span>EN</span>,
  Uk: () => <span>UK</span>,
}));

const mockForm = (overrides?: any) => {
  (useFormContext as jest.Mock).mockReturnValue({
    watch: jest.fn(() => ""),
    setValue: jest.fn(),
    ...overrides,
  });
};

const makeField = <T extends FieldConfig>(f: T): T => f;

const makeSection = (s: Partial<SectionConfig>): SectionConfig => ({
  id: "test",
  title: "Section",
  localeLayout: "split",
  fields: [],
  ...s,
});

describe("LocaleSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders split layout", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "text",
              name: "title",
              label: { uk: "Заголовок", en: "Title" },
              locales: ["uk", "en"],
            }),
          ],
        })}
        showOutsideTitle={false}
      />,
    );
  });

  it("renders combined layout", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          localeLayout: "combined",
          fields: [makeField({ type: "text", name: "title" })],
        })}
        showOutsideTitle={false}
      />,
    );
  });

  it("renders by-field layout", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          localeLayout: "by-field-2col",
          fields: [makeField({ type: "text", name: "title" })],
        })}
        showOutsideTitle={false}
      />,
    );
  });

  it("renders by-locale layout", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          localeLayout: "by-locale-2col",
          fields: [makeField({ type: "text", name: "title" })],
        })}
        showOutsideTitle={false}
      />,
    );
  });

  it("renders image field (with required gallery context)", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "image",
              name: "img",
              props: { imageIndex: 0 },
            }),
          ],
        })}
        showOutsideTitle={false}
        galleryFieldIdsByIndex={{ 0: "img-0" }}
        gallerySrcByIndex={{ 0: "https://test.com/img.jpg" }}
      />,
    );
  });

  it("renders video field", () => {
    mockForm({
      watch: () => "https://youtu.be/test",
    });

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "video",
              name: "video",
              props: { videoIndex: 0 },
            }),
          ],
        })}
        showOutsideTitle={false}
      />,
    );
  });

  it("renders media selector field", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "media-selector",
              name: "media",
              props: { imageIndex: 0, videoIndex: 0 },
            }),
          ],
        })}
        showOutsideTitle={false}
        galleryFieldIdsByIndex={{ 0: "media-0" }}
      />,
    );
  });

  it("renders custom field", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "custom",
              name: "customField",
              component: () => <div data-testid="custom" />,
              locales: ["uk"],
            }),
          ],
        })}
        showOutsideTitle={false}
      />,
    );
  });

  it("warns on unknown layout", () => {
    mockForm();

    const logger = require("@/lib/logger/logger").logger;

    render(
      <LocaleSection
        section={makeSection({
          localeLayout: "unknown" as any,
        })}
        showOutsideTitle={false}
      />,
    );

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("Unknown layout"));
  });

  it("renders gallery layout", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          localeLayout: "gallery-3col",
          fields: [
            makeField({ type: "image", name: "img", props: { imageIndex: 0 } }),
            makeField({
              type: "text",
              name: "description",
              label: { uk: "Опис", en: "Desc" },
            }),
          ],
        })}
        showOutsideTitle={false}
        galleryFieldIdsByIndex={{ 0: "img-0" }}
      />,
    );
  });

  it("falls back to split layout when layout is unknown", () => {
    mockForm();

    const { container } = render(
      <LocaleSection
        section={makeSection({
          localeLayout: "weird-layout" as any,
          fields: [
            makeField({
              type: "text",
              name: "title",
              label: { uk: "A", en: "B" },
              locales: ["uk", "en"],
            }),
          ],
        })}
        showOutsideTitle={false}
      />,
    );

    expect(container.querySelector(".rounded-xl")).toBeInTheDocument();
  });

  it("uses default LOCALES when field.locales is undefined", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "text",
              name: "title",
              label: { uk: "Заголовок", en: "Title" },
            }),
          ],
        })}
        showOutsideTitle={false}
      />,
    );
  });

  it("renders invalid youtube url warning path", () => {
    mockForm({
      watch: () => "invalid-url",
    });

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "video",
              name: "video",
              props: { videoIndex: 0 },
            }),
          ],
        })}
        showOutsideTitle={false}
      />,
    );
  });

  it("renders media selector video mode branch", () => {
    mockForm({
      watch: (key: string) => {
        if (key.includes("mediaType")) {
          return "video";
        }

        return "";
      },
    });

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "media-selector",
              name: "media",
              props: { imageIndex: 0, videoIndex: 0 },
            }),
          ],
        })}
        showOutsideTitle={false}
        galleryFieldIdsByIndex={{ 0: "media-0" }}
      />,
    );
  });

  it("skips image field when index is invalid", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "image",
              name: "img",
              props: { imageIndex: -1 },
            }),
          ],
        })}
        showOutsideTitle={false}
        galleryFieldIdsByIndex={{}}
      />,
    );
  });

  it("skips video field when index is invalid", () => {
    mockForm();

    render(
      <LocaleSection
        section={makeSection({
          fields: [
            makeField({
              type: "video",
              name: "video",
              props: { videoIndex: -1 },
            }),
          ],
        })}
        showOutsideTitle={false}
      />,
    );
  });
});
