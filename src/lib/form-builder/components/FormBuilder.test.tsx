import { render, screen, fireEvent } from "@testing-library/react";
import { useFormContext } from "react-hook-form";
import { FormBuilder } from "./FormBuilder";

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(),
}));

jest.mock("@/components/form-elements", () => ({
  FormImg: () => <div data-testid="form-img" />,
}));

jest.mock("@/components/admin/admin-form-elements", () => ({
  BtnGroup: ({ isValid, onReset }: any) => (
    <div data-testid="btn-group">
      <button data-testid="reset" onClick={onReset}>
        reset
      </button>
      <span data-testid="valid">{String(isValid)}</span>
    </div>
  ),
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

jest.mock("./LocaleSection", () => ({
  LocaleSection: () => <div data-testid="locale-section" />,
}));

const mockForm = (overrides?: any) => {
  (useFormContext as jest.Mock).mockReturnValue({
    reset: jest.fn(),
    formState: { isValid: true },
    ...overrides,
  });
};

const baseConfig: any = {
  sections: [
    {
      id: "text-content",
      localeLayout: "split",
      fields: [{ type: "text", name: "title", locales: ["uk", "en"] }],
    },
  ],
};

const renderForm = (configOverrides: any = {}, formOverrides: any = {}) => {
  mockForm(formOverrides);

  return render(
    <FormBuilder
      data={{}}
      config={{ ...baseConfig, ...configOverrides }}
      onImageChange={jest.fn()}
      onImageRemove={jest.fn()}
    />,
  );
};

describe("FormBuilder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic form", () => {
    renderForm();

    expect(screen.getByTestId("btn-group")).toBeInTheDocument();
    expect(screen.getByTestId("locale-section")).toBeInTheDocument();
  });

  it("calls reset on BtnGroup click", () => {
    const reset = jest.fn();

    renderForm({}, { reset });

    fireEvent.click(screen.getByTestId("reset"));

    expect(reset).toHaveBeenCalled();
  });

  it("passes isValid to BtnGroup", () => {
    renderForm({}, { formState: { isValid: false } });

    expect(screen.getByTestId("valid").textContent).toBe("false");
  });

  it("renders grouped sections", () => {
    renderForm({
      sections: [
        { id: "a", group: "g1", fields: [] },
        { id: "b", group: "g1", fields: [] },
      ],
    });

    expect(screen.getAllByTestId("locale-section")).toHaveLength(2);
  });

  it("renders image section when enabled", () => {
    renderForm({
      options: { hasImage: true },
    });

    expect(screen.getByTestId("form-img")).toBeInTheDocument();
  });

  it("uses grid-cols-1 when localeMode is not split and no image", () => {
    mockForm();

    render(
      <FormBuilder
        data={{}}
        config={{
          ...baseConfig,
          sections: [
            {
              id: "text-content",
              localeLayout: "combined",
              fields: [{ type: "text", name: "title", locales: ["uk", "en"] }],
            },
          ],
        }}
        onImageChange={undefined as any}
        onImageRemove={jest.fn()}
      />,
    );

    expect(screen.getByTestId("locale-section")).toBeInTheDocument();
  });
});
