import { infoSchema, socialLinkSchema, feedbackContentSchema } from "@/schemas/feedback-content.schema";
import { ContactsType, SocialPlatform } from "@/constants";

describe("infoSchema", () => {
  it("should accept valid phone contact", () => {
    const result = infoSchema.safeParse({
      type: ContactsType.PHONE,
      href: "+380991112233",
      label: "Phone",
      textHref: "Call us",
    });

    expect(result.success).toBe(true);
  });

  it("should accept valid email contact", () => {
    const result = infoSchema.safeParse({
      type: ContactsType.EMAIL,
      href: "test@example.com",
      label: "Email",
      textHref: "Write us",
    });

    expect(result.success).toBe(true);
  });

  it("should accept valid location contact", () => {
    const result = infoSchema.safeParse({
      type: ContactsType.LOCATION,
      href: "https://maps.google.com",
      label: "Office",
      textHref: "Open map",
    });

    expect(result.success).toBe(true);
  });

  it("should reject contact when required fields are missing", () => {
    const result = infoSchema.safeParse({
      type: ContactsType.PHONE,
      href: "",
      label: "",
      textHref: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("socialLinkSchema", () => {
  it("should accept valid social link", () => {
    const result = socialLinkSchema.safeParse({
      platform: SocialPlatform.TELEGRAM,
      href: "https://t.me/company",
    });

    expect(result.success).toBe(true);
  });

  it("should reject social link without href", () => {
    const result = socialLinkSchema.safeParse({
      platform: SocialPlatform.TELEGRAM,
      href: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("feedbackContentSchema", () => {
  it("should accept valid feedback content", () => {
    const result = feedbackContentSchema.safeParse({
      directContactTitle: "Контакти",
      responseTimeTitle: "Час відповіді",
      responseTimeDescription: "До 24 годин",
      socialMediaTitle: "Соцмережі",

      contacts: {
        socialLinks: [
          {
            platform: SocialPlatform.TELEGRAM,
            href: "https://t.me/company",
          },
        ],
        info: [
          {
            type: ContactsType.PHONE,
            href: "+380991112233",
            label: "Телефон",
            textHref: "Зателефонувати",
          },
        ],
      },

      form: {
        title: "Зв'язатися",
        modalTitle: "Форма",
        descriptionInputTitle: "Опис",
        descriptionInputPlaceholder: "Введіть текст",
        radioButtonsTitle: "Тип звернення",
        radioButtons: [
          {
            label: "Запит",
          },
        ],
        buttonSubmit: "Відправити",
        privacyPolicyTitle: "Політика",
        privacyPolicyTextLink: "Детальніше",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should reject feedback content when required root fields are empty", () => {
    const result = feedbackContentSchema.safeParse({
      directContactTitle: "",
      responseTimeTitle: "",
      responseTimeDescription: "",
      socialMediaTitle: "",
    });

    expect(result.success).toBe(false);
  });

  it("should accept feedback content without optional contacts and form", () => {
    const result = feedbackContentSchema.safeParse({
      directContactTitle: "Контакти",
      responseTimeTitle: "Час відповіді",
      responseTimeDescription: "До 24 годин",
      socialMediaTitle: "Соцмережі",
    });

    expect(result.success).toBe(true);
  });
});
