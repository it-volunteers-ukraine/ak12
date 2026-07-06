import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { logout } from "@/actions/auth/logout.action";

jest.mock("next/navigation", () => ({
  useParams: () => ({
    locale: "uk",
  }),
}));

jest.mock("@/actions/auth/logout.action", () => ({
  logout: jest.fn(),
}));

jest.mock("../../../public/icons", () => ({
  LogoutIcon: () => <div>LogoutIcon</div>,
}));

const { LogoutForm } = require("./logout-form");

describe("LogoutForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render logout button", () => {
    render(<LogoutForm />);

    expect(
      screen.getByRole("button", {
        name: "Вийти",
      }),
    ).toBeInTheDocument();
  });

  it("should render logout icon", () => {
    render(<LogoutForm />);

    expect(screen.getByText("LogoutIcon")).toBeInTheDocument();
  });

  it("should have title attribute on the button", () => {
    render(<LogoutForm />);

    expect(
      screen.getByRole("button", {
        name: "Вийти",
      }),
    ).toHaveAttribute("title", "Вийти");
  });

  it("should call logout with formData containing locale on submit", async () => {
    render(<LogoutForm />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Вийти",
      }),
    );

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
    });

    const submittedFormData = (logout as jest.Mock).mock.calls[0][0] as FormData;

    expect(submittedFormData.get("locale")).toBe("uk");
  });
});
