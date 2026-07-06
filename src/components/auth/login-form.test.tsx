import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { State } from "@/types";

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

let twoFactorState: State;
let twoFactorPending: boolean;

beforeEach(() => {
  jest.clearAllMocks();

  loginState = {
    fieldErrors: {},
    error: "",
  };

  loginPending = false;

  twoFactorState = {
    fieldErrors: {},
    error: "",
  };

  twoFactorPending = false;

  let call = 0;

  mockUseActionState.mockImplementation(() => {
    call++;

    if (call % 2 === 1) {
      return [loginState, jest.fn(), loginPending];
    }

    return [twoFactorState, jest.fn(), twoFactorPending];
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
  });
});
