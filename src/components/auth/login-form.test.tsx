import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { State } from "@/types";
import { adminLogin, verifyTwoFactor } from "@/actions/auth/login.action";

const mockUseActionState = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({
    locale: "uk",
  }),
}));

jest.mock("react", () => {
  const actual = jest.requireActual("react");

  return {
    ...actual,
    useActionState: (...args: unknown[]) => mockUseActionState(...args),
  };
});

jest.mock("../../../public/icons", () => ({
  LoginEyeOffIcon: () => <div>EyeOff</div>,
  LoginEyeOnIcon: () => <div>EyeOn</div>,
}));

jest.mock("@/actions/auth/login.action", () => ({
  adminLogin: jest.fn(),
  verifyTwoFactor: jest.fn(),
}));

const { LoginForm } = require("./login-form");

let loginState: State;
let loginPending: boolean;
let loginActionMock: jest.Mock;

let twoFactorState: State;
let twoFactorPending: boolean;
let twoFaActionMock: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();

  loginState = {
    fieldErrors: {},
    error: "",
  };

  loginPending = false;
  loginActionMock = jest.fn();

  twoFactorState = {
    fieldErrors: {},
    error: "",
  };

  twoFactorPending = false;
  twoFaActionMock = jest.fn();

  let call = 0;

  mockUseActionState.mockImplementation(() => {
    call++;

    if (call % 2 === 1) {
      return [loginState, loginActionMock, loginPending];
    }

    return [twoFactorState, twoFaActionMock, twoFactorPending];
  });
});

describe("LoginForm", () => {
  it("should render login form", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Увійти",
      }),
    ).toBeInTheDocument();
  });

  it("should toggle password visibility", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const password = screen.getByLabelText("Пароль");

    expect(password).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", {
        name: "Показати пароль",
      }),
    );

    expect(password).toHaveAttribute("type", "text");

    await user.click(
      screen.getByRole("button", {
        name: "Приховати пароль",
      }),
    );

    expect(password).toHaveAttribute("type", "password");
  });

  it("should allow entering email and password", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Пароль");

    await user.type(email, "admin@example.com");
    await user.type(password, "Strong-Pass-1234");

    expect(email).toHaveValue("admin@example.com");
    expect(password).toHaveValue("Strong-Pass-1234");
  });

  it("should display email validation error", () => {
    loginState = {
      fieldErrors: {
        email: ["Invalid email"],
      },
      error: "",
    };

    render(<LoginForm />);

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("should display password validation error", () => {
    loginState = {
      fieldErrors: {
        password: ["Invalid password"],
      },
      error: "",
    };

    render(<LoginForm />);

    expect(screen.getByText("Invalid password")).toBeInTheDocument();
  });

  it("should disable submit button when form submission is pending", () => {
    loginPending = true;

    render(<LoginForm />);

    expect(
      screen.getByRole("button", {
        name: "Увійти",
      }),
    ).toBeDisabled();
  });

  it("should call loginAction with email and password on submit", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Пароль"), "Strong-Pass-1234");

    await user.click(
      screen.getByRole("button", {
        name: "Увійти",
      }),
    );

    await waitFor(() => {
      expect(loginActionMock).toHaveBeenCalledTimes(1);
    });

    const formData = loginActionMock.mock.calls[0][0] as FormData;

    expect(formData.get("email")).toBe("admin@example.com");
    expect(formData.get("password")).toBe("Strong-Pass-1234");
  });

  it("should append locale to formData before calling adminLogin", () => {
    render(<LoginForm />);

    const loginReducer = mockUseActionState.mock.calls[0][0] as (prevState: State, formData: FormData) => unknown;

    const formData = new FormData();

    formData.append("email", "admin@example.com");
    formData.append("password", "Strong-Pass-1234");

    loginReducer(loginState, formData);

    expect(formData.get("locale")).toBe("uk");
    expect(adminLogin).toHaveBeenCalledWith(loginState, formData);
  });

  describe("Two factor authentication", () => {
    beforeEach(() => {
      loginState = {
        fieldErrors: {},
        error: "",
        needsTwoFactor: true,
        locale: "uk",
      };
    });

    it("should render two factor form", () => {
      render(<LoginForm />);

      expect(screen.getByText("Код підтвердження")).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Підтвердити",
        }),
      ).toBeInTheDocument();
    });

    it("should render six code inputs", () => {
      render(<LoginForm />);

      expect(screen.getAllByRole("textbox")).toHaveLength(6);
    });

    it("should disable confirm button until six digits are entered", () => {
      render(<LoginForm />);

      expect(
        screen.getByRole("button", {
          name: "Підтвердити",
        }),
      ).toBeDisabled();
    });

    it("should display two factor validation error", () => {
      twoFactorState = {
        fieldErrors: {
          code: ["Невірний код"],
        },
        error: "",
      };

      render(<LoginForm />);

      expect(screen.getByText("Невірний код")).toBeInTheDocument();
    });

    it("should filter non-numeric characters and auto-focus next digit input", async () => {
      const user = userEvent.setup();

      render(<LoginForm />);

      const inputs = screen.getAllByRole("textbox");

      await user.type(inputs[0], "a");
      expect(inputs[0]).toHaveValue("");

      await user.type(inputs[0], "5");
      expect(inputs[0]).toHaveValue("5");
      expect(inputs[1]).toHaveFocus();
    });

    it("should not move focus forward when the last digit input is filled", async () => {
      const user = userEvent.setup();

      render(<LoginForm />);

      const inputs = screen.getAllByRole("textbox");

      await user.click(inputs[5]);
      await user.type(inputs[5], "9");

      expect(inputs[5]).toHaveValue("9");
      expect(inputs[5]).toHaveFocus();
    });

    it("should focus previous digit input on backspace when current input is empty", async () => {
      const user = userEvent.setup();

      render(<LoginForm />);

      const inputs = screen.getAllByRole("textbox");

      await user.click(inputs[1]);
      await user.keyboard("{Backspace}");

      expect(inputs[0]).toHaveFocus();
    });

    it("should not move focus back on backspace at the first digit input", async () => {
      const user = userEvent.setup();

      render(<LoginForm />);

      const inputs = screen.getAllByRole("textbox");

      await user.click(inputs[0]);
      await user.keyboard("{Backspace}");

      expect(inputs[0]).toHaveFocus();
    });

    it("should distribute pasted digits across inputs", () => {
      render(<LoginForm />);

      const inputs = screen.getAllByRole("textbox");

      fireEvent.paste(inputs[0], {
        clipboardData: {
          getData: () => "123456",
        },
      });

      inputs.forEach((input, index) => {
        expect(input).toHaveValue(String(index + 1));
      });
    });

    it("should clamp focus to the last input when pasted value exceeds code length", () => {
      render(<LoginForm />);

      const inputs = screen.getAllByRole("textbox");

      fireEvent.paste(inputs[0], {
        clipboardData: {
          getData: () => "1234567890",
        },
      });

      expect(inputs[5]).toHaveFocus();
    });

    it("should enable confirm button once all six digits are entered", async () => {
      const user = userEvent.setup();

      render(<LoginForm />);

      const inputs = screen.getAllByRole("textbox");

      for (const input of inputs) {
        await user.type(input, "1");
      }

      expect(
        screen.getByRole("button", {
          name: "Підтвердити",
        }),
      ).toBeEnabled();
    });

    it("should disable confirm button when two factor submission is pending even with six digits", async () => {
      const user = userEvent.setup();

      twoFactorPending = true;

      render(<LoginForm />);

      const inputs = screen.getAllByRole("textbox");

      for (const input of inputs) {
        await user.type(input, "1");
      }

      expect(
        screen.getByRole("button", {
          name: "Підтвердити",
        }),
      ).toBeDisabled();
    });

    it("should call twoFaAction on submit once six digits are entered", async () => {
      const user = userEvent.setup();

      render(<LoginForm />);

      const inputs = screen.getAllByRole("textbox");

      for (const input of inputs) {
        await user.type(input, "7");
      }

      await user.click(
        screen.getByRole("button", {
          name: "Підтвердити",
        }),
      );

      await waitFor(() => {
        expect(twoFaActionMock).toHaveBeenCalledTimes(1);
      });
    });

    it("should append locale and joined digits as code before calling verifyTwoFactor", () => {
      render(<LoginForm />);

      const twoFaReducer = mockUseActionState.mock.calls[1][0] as (prevState: State, formData: FormData) => unknown;

      const formData = new FormData();

      twoFaReducer(twoFactorState, formData);

      expect(formData.get("locale")).toBe("uk");
      expect(formData.get("code")).toBe("");
      expect(verifyTwoFactor).toHaveBeenCalledWith(twoFactorState, formData);
    });

    it("should render Повернутись button", () => {
      render(<LoginForm />);

      expect(
        screen.getByRole("button", {
          name: "Повернутись",
        }),
      ).toBeInTheDocument();
    });
  });
});
