import { SECTION_KEYS, SectionKey } from "@/constants";
import { Locale } from "@/types";
import {
  FeedbackContent,
  FooterContent,
  HeaderContent,
} from "@/schemas";

type LocaleContent<Content> = Record<Locale, Content>;
type HeaderAndFooterContent = { header: HeaderContent; footer: FooterContent };
type DefaultContent = FeedbackContent | HeaderAndFooterContent;

const defaultFeedbackContent = {
  uk: {
    contacts: {
      socialLinks: [],
      info: [],
    },
    form: {
      title: "Зворотний зв’язок",
      modalTitle: "Залишити звернення",
      descriptionInputTitle: "Ваше повідомлення",
      descriptionInputPlaceholder: "Опишіть ваше питання",
      radioButtonsTitle: "Тип звернення",
      radioButtons: [{ label: "Загальне питання" }, { label: "Питання щодо вакансії" }],
      buttonSubmit: "Надіслати",
      privacyPolicyTitle: "Політика конфіденційності",
      privacyPolicyTextLink: "Ознайомитися",
    },
    directContactTitle: "Контакти",
    responseTimeTitle: "Час відповіді",
    responseTimeDescription: "Ми опрацюємо ваше звернення та зв’яжемося з вами.",
    socialMediaTitle: "Ми в соціальних мережах",
  },
  en: {
    contacts: {
      socialLinks: [],
      info: [],
    },
    form: {
      title: "Get in touch",
      modalTitle: "Send us a message",
      descriptionInputTitle: "Your message",
      descriptionInputPlaceholder: "Describe your question",
      radioButtonsTitle: "Request type",
      radioButtons: [{ label: "General question" }, { label: "Vacancy question" }],
      buttonSubmit: "Send",
      privacyPolicyTitle: "Privacy policy",
      privacyPolicyTextLink: "Read the privacy policy",
    },
    directContactTitle: "Contact",
    responseTimeTitle: "Response time",
    responseTimeDescription: "We’ll review your message and get back to you.",
    socialMediaTitle: "Follow us on social media",
  },
} satisfies LocaleContent<FeedbackContent>;

const defaultHeaderAndFooterContent = {
  uk: {
    header: {
      logoText: "12-й Армійський корпус",
      subLogoText: "12 АК",
      links: [
        { idSection: "about", label: "Про корпус" },
        { idSection: "subdivisions", label: "Підрозділи" },
        { idSection: "vacancy", label: "Вакансії" },
        { idSection: "join", label: "Приєднатися" },
        { idSection: "contacts", label: "Контакти" },
      ],
      button: { href: "#vacancy", text: "Подати заявку" },
      logoImg: null,
    },
    footer: {
      title: "12-й Армійський корпус",
      description: "Залишайте заявку або звертайтеся через офіційні канали зв’язку.",
      copyright: "© 12 АК",
      copyrightOwner: "12-й Армійський корпус",
      logoImg: null,
    },
  },
  en: {
    header: {
      logoText: "12th Army Corps",
      subLogoText: "12 AC",
      links: [
        { idSection: "about", label: "About the Corps" },
        { idSection: "subdivisions", label: "Units" },
        { idSection: "vacancy", label: "Vacancies" },
        { idSection: "join", label: "Join us" },
        { idSection: "contacts", label: "Contact" },
      ],
      button: { href: "#vacancy", text: "Apply" },
      logoImg: null,
    },
    footer: {
      title: "12th Army Corps",
      description: "Submit an application or reach out through official communication channels.",
      copyright: "© 12 AC",
      copyrightOwner: "12th Army Corps",
      logoImg: null,
    },
  },
} satisfies LocaleContent<HeaderAndFooterContent>;

export const getDefaultContent = (section: SectionKey, locale: Locale): DefaultContent | null => {
  switch (section) {
    case SECTION_KEYS.FEEDBACK:
      return defaultFeedbackContent[locale];
    case SECTION_KEYS.HEADER:
      return defaultHeaderAndFooterContent[locale];
    default:
      return null;
  }
};
