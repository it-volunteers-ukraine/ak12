import { useRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import { useOutsideClick } from "./outSideClick";

describe("useOutsideClick", () => {
  const callback = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  function TestComponent() {
    const ref = useRef<HTMLDivElement>(null);

    useOutsideClick(callback, ref);

    return (
      <div>
        <div ref={ref} data-testid="inside">
          inside
        </div>
        <div data-testid="outside">outside</div>
      </div>
    );
  }

  it("calls callback when clicking outside", () => {
    const { getByTestId } = render(<TestComponent />);

    fireEvent.click(getByTestId("outside"));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not call callback when clicking inside", () => {
    const { getByTestId } = render(<TestComponent />);

    fireEvent.click(getByTestId("inside"));

    expect(callback).not.toHaveBeenCalled();
  });

  it("registers and removes event listener", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    const removeSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = render(<TestComponent />);

    expect(addSpy).toHaveBeenCalledWith("click", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("click", expect.any(Function));
  });

  it("works with array of refs", () => {
    function ArrayRefsComponent() {
      const ref1 = useRef<HTMLDivElement>(null);
      const ref2 = useRef<HTMLDivElement>(null);

      useOutsideClick(callback, [ref1, ref2]);

      return (
        <>
          <div ref={ref1} data-testid="one" />
          <div ref={ref2} data-testid="two" />
          <div data-testid="outside" />
        </>
      );
    }

    const { getByTestId } = render(<ArrayRefsComponent />);

    fireEvent.click(getByTestId("outside"));

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
