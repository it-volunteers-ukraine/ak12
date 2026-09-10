import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackForm } from "./index";
import { sendFeedbackAction } from "@/actions/feedback";
import { showMessage } from "@/components/toastify";

jest.mock("@/actions/feedback", () => ({
  sendFeedbackAction: jest.fn(),
}));

jest.mock("../../../public/icons", () => ({
  SubmitIcon: () => <span>SubmitIcon</span>,
  ArrowRightIcon: () => <span>ArrowRightIcon</span>,
}));

jest.mock("../policy-modal", () => ({
  PolicyButton: ({ text, textLink }: { text: string; textLink: string }) => (
    <div>
      {text} {textLink}
    </div>
  ),
}));

jest.mock("../toastify/show-message", () => ({
  showMessage: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    return (key: string) => `${namespace}.${key}`;
  },
}));

const MOCK_FEEDBACK_CONTENT = {
  title: "Зворотний зв'язок",
  modalTitle: "Напишіть нам",
  descriptionInputTitle: "Опис звернення",
  descriptionInputPlaceholder: "Опишіть ваше звернення детальніше...",
  radioButtonsTitle: "Оберіть тему звернення",
  radioButtons: [{ label: "Вступ до підрозділу" }, { label: "Переведення" }],
  buttonSubmit: "Надіслати",
  privacyPolicyTitle: "Політика конфіденційності",
  privacyPolicyTextLink: "ознайомлений",
};

const MOCK_VALID_FORM_DATA = {
  firstName: "Іван",
  lastName: "Франко",
  email: "ivan.franko@example.com",
  phone: "+380501234567",
  description: "Доброго дня, хочу долучитися до лав корпусу.",
  subjectLabel: "Вступ до підрозділу",
};

const FORM_RENDER_ELEMENTS = [
  "form.firstName",
  "form.lastName",
  "form.email",
  "form.phone",
  "Опис звернення",
  "Оберіть тему звернення",
  "Вступ до підрозділу",
  "Переведення",
];

const fillFeedbackForm = async (user: ReturnType<typeof userEvent.setup>, data = MOCK_VALID_FORM_DATA) => {
  await user.type(screen.getByPlaceholderText("form.placeholderFirstName"), data.firstName);
  await user.type(screen.getByPlaceholderText("form.placeholderLastName"), data.lastName);
  await user.type(screen.getByPlaceholderText("form.placeholderEmail"), data.email);
  await user.type(screen.getByPlaceholderText("form.placeholderPhone"), data.phone);
  await user.type(screen.getByPlaceholderText(MOCK_FEEDBACK_CONTENT.descriptionInputPlaceholder), data.description);
  await user.click(screen.getByLabelText(data.subjectLabel));
};

describe("FeedbackForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it.each(FORM_RENDER_ELEMENTS)("should render element with text '%s'", (text) => {
      render(<FeedbackForm content={MOCK_FEEDBACK_CONTENT} privacyPolicyContent={null} />);

      expect(screen.getByText(text)).toBeInTheDocument();
    });

    it("should render submit button", () => {
      render(<FeedbackForm content={MOCK_FEEDBACK_CONTENT} privacyPolicyContent={null} />);

      expect(
        screen.getByRole("button", { name: new RegExp(MOCK_FEEDBACK_CONTENT.buttonSubmit, "i") }),
      ).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("should call sendFeedbackAction and display success message on valid submission", async () => {
      (sendFeedbackAction as jest.Mock).mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      const onSuccessAction = jest.fn();

      render(
        <FeedbackForm
          content={MOCK_FEEDBACK_CONTENT}
          privacyPolicyContent={null}
          onSuccessAction={onSuccessAction}
        />,
      );

      await fillFeedbackForm(user);
      await user.click(screen.getByRole("button", { name: new RegExp(MOCK_FEEDBACK_CONTENT.buttonSubmit, "i") }));

      await waitFor(() => {
        expect(sendFeedbackAction).toHaveBeenCalled();
        expect(showMessage.success).toHaveBeenCalledWith("form.successMessage");
        expect(onSuccessAction).toHaveBeenCalled();
      });
    });

    it("should show error toast if submission fails", async () => {
      (sendFeedbackAction as jest.Mock).mockResolvedValueOnce({
        success: false,
        error: "Failed",
      });
      const user = userEvent.setup();

      render(<FeedbackForm content={MOCK_FEEDBACK_CONTENT} privacyPolicyContent={null} />);

      await fillFeedbackForm(user);
      await user.click(screen.getByRole("button", { name: new RegExp(MOCK_FEEDBACK_CONTENT.buttonSubmit, "i") }));

      await waitFor(() => {
        expect(sendFeedbackAction).toHaveBeenCalled();
        expect(showMessage.error).toHaveBeenCalledWith("form.errorMessage");
      });
    });
  });
});
