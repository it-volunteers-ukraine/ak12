import { render, screen } from "@testing-library/react";

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
  it("should render logout button", () => {
    render(<LogoutForm />);

    expect(
      screen.getByRole("button", {
        name: "Вийти",
      }),
    ).toBeInTheDocument();
  });
});
