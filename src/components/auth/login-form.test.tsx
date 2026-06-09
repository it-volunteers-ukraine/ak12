import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

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

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseActionState.mockReturnValue([
      {
        fieldErrors: {},
        error: "",
      },
      jest.fn(),
      false,
    ]);
  });

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

    const passwordInput = screen.getByLabelText("Пароль");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", {
        name: "Показати пароль",
      }),
    );

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(
      screen.getByRole("button", {
        name: "Приховати пароль",
      }),
    );

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should allow entering email and password", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Пароль");

    await user.type(emailInput, "admin@example.com");
    await user.type(passwordInput, "Strong-Pass-1234");

    expect(emailInput).toHaveValue("admin@example.com");
    expect(passwordInput).toHaveValue("Strong-Pass-1234");
  });

  it("should display email validation error", () => {
    mockUseActionState.mockReturnValue([
      {
        fieldErrors: {
          email: ["Invalid email"],
        },
        error: "",
      },
      jest.fn(),
      false,
    ]);

    render(<LoginForm />);

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("should display password validation error", () => {
    mockUseActionState.mockReturnValue([
      {
        fieldErrors: {
          password: ["Invalid password"],
        },
        error: "",
      },
      jest.fn(),
      false,
    ]);

    render(<LoginForm />);

    expect(screen.getByText("Invalid password")).toBeInTheDocument();
  });

  it("should display general error message", () => {
    mockUseActionState.mockReturnValue([
      {
        fieldErrors: {},
        error: "Something went wrong",
      },
      jest.fn(),
      false,
    ]);

    render(<LoginForm />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should disable submit button when form submission is pending", () => {
    mockUseActionState.mockReturnValue([
      {
        fieldErrors: {},
        error: "",
      },
      jest.fn(),
      true,
    ]);

    render(<LoginForm />);

    expect(
      screen.getByRole("button", {
        name: "Увійти",
      }),
    ).toBeDisabled();
  });
});
