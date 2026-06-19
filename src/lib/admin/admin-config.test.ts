jest.mock("@/components/admin", () => ({
  HeroSection: () => null,
  FeedbackSection: () => null,
  TransferSection: () => null,
  AboutSectionAdmin: () => null,
  Contract1824Section: () => null,
  HeaderFooterSection: () => null,
  MobilizationSection: () => null,
  PrivacyPolicySection: () => null,
}));

jest.mock("@/schemas", () => ({
  transferSchema: {},
  heroContentSchema: {},
  contract1824Schema: {},
  mobilizationSchema: {},
  feedbackContentSchema: {},
  headerAndFooterContentSchema: {},
  privacyPolicySchema: {},
}));

jest.mock("@/schemas/about-us.schema", () => ({
  aboutUsSchema: {},
}));

jest.mock("@/actions/hero/hero.action", () => ({}));
jest.mock("@/actions/admin/upload-image.action", () => ({}));

import { ADMIN_CONFIG, getAdminSectionConfig } from "./admin-config";
import { SECTION_KEYS } from "@/constants";

describe("ADMIN_CONFIG", () => {
  it("should contain all keys", () => {
    expect(Object.keys(ADMIN_CONFIG)).toEqual(
      expect.arrayContaining([
        "about",
        "hero",
        "mobilization",
        "contract-18-24",
        "transfer",
        "feedback",
        "header-footer",
        "privacy-policy",
      ]),
    );
  });

  it("should map section keys correctly", () => {
    expect(ADMIN_CONFIG.hero.sectionKey).toBe(SECTION_KEYS.HERO);
    expect(ADMIN_CONFIG.about.sectionKey).toBe(SECTION_KEYS.ABOUT);
  });

  it("should have valid structure", () => {
    Object.values(ADMIN_CONFIG).forEach((config) => {
      expect(config.label).toBeTruthy();
      expect(config.schema).toBeDefined();
      expect(config.component).toBeDefined();
    });
  });
});

describe("getAdminSectionConfig", () => {
  it("should return correct config", () => {
    const config = getAdminSectionConfig("hero");

    expect(config.label).toBe("Головний екран");
  });

  it("should return same reference", () => {
    expect(getAdminSectionConfig("hero")).toBe(ADMIN_CONFIG.hero);
  });
});
