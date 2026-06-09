import { render, screen } from "@testing-library/react";
import LoginPage from "./page";

jest.mock("@/components/", () => ({
  LoginForm: () => <div>Mock Login Form</div>,
}));

describe("LoginPage", () => {
  it("should render login form", () => {
    render(<LoginPage />);

    expect(screen.getByText("Mock Login Form")).toBeInTheDocument();
  });
});
