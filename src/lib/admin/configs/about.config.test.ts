import { createAboutFormBuilderConfig } from "./about.config";
import { SectionConfig, FieldConfig } from "@/lib/form-builder/types";

type Config = ReturnType<typeof createAboutFormBuilderConfig>;

const getSection = (config: Config, id: string): SectionConfig | undefined => config.sections.find((s) => s.id === id);

const getField = (section: SectionConfig | undefined, name: string): FieldConfig | undefined =>
  section?.fields.find((f) => typeof f.name === "string" && f.name === name);

describe("createAboutFormBuilderConfig", () => {
  const config = createAboutFormBuilderConfig(12);

  it("should generate base config", () => {
    expect(config.id).toBe("about");

    expect(config.sectionGroups).toMatchObject({
      "about-gallery": {
        className: "grid grid-cols-1 gap-8",
        title: "Галерея",
      },
      "about-other-gallery": {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
        title: "Додаткова галерея",
      },
    });
  });

  it("should include main section", () => {
    const main = getSection(config, "main-content");

    expect(main).toBeDefined();
    expect(main?.fields.length).toBe(2);

    const title = getField(main, "mainTitle");
    const desc = getField(main, "description");

    expect(title?.type).toBe("text");
    expect(desc?.type).toBe("textarea");
  });

  it("should generate preview gallery (slice + map execution)", () => {
    const preview = config.sections.filter((s) => s.id.startsWith("gallery_item_")).slice(0, 9);

    expect(preview).toHaveLength(9);

    preview.forEach((section, index) => {
      expect(section.id).toBe(`gallery_item_${index}`);
      expect(section.group).toBe("about-gallery");

      const media = section.fields.find((f) => typeof f.name === "string" && f.name.includes(".__media"));

      const text = section.fields.find((f) => typeof f.name === "string" && f.name.includes(".text"));

      expect(media).toBeDefined();
      expect(text).toBeDefined();

      const expectedLabel = index === 0 ? "Заголовок" : "Опис";

      expect(text?.label?.uk).toBe(expectedLabel);
      expect(text?.label?.en).toBe(expectedLabel);
    });
  });

  it("should generate other gallery sections", () => {
    const other = config.sections.filter((s) => s.group === "about-other-gallery");

    expect(other.length).toBeGreaterThan(0);

    other.forEach((section) => {
      expect(section.localeLayout).toBe("combined");
      expect(section.hideLocaleBadge).toBe(true);

      const media = section.fields.find((f) => typeof f.name === "string" && f.name.includes(".__media"));

      expect(media?.type).toBe("media-selector");
    });
  });

  it("should ensure all sections have valid structure", () => {
    config.sections.forEach((section) => {
      expect(section.id).toBeTruthy();
      expect(Array.isArray(section.fields)).toBe(true);

      section.fields.forEach((field) => {
        expect(field.name).toBeTruthy();
        expect(field.type).toBeTruthy();
      });
    });
  });
});
