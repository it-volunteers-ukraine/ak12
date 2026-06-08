import { render, screen } from "@testing-library/react";
import { LogoutForm } from "./logout-form";

jest.mock("next/navigation", () => ({
  useParams: () => ({
    locale: "uk",
  }),
}));

jest.mock("../../../public/icons", () => ({
  LogoutIcon: () => <div>LogoutIcon</div>,
}));

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
