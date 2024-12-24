import { fireEvent, render, screen } from "@testing-library/react";
import { Range } from "../components/Range";

describe("Range Component", () => {
  it("Renderiza correctamente con valores iniciales", () => {
    const { getByText } = render(<Range min={0} max={100} />);

    expect(getByText("0.00 €")).toBeInTheDocument();
    expect(getByText("100.00 €")).toBeInTheDocument();
  });

  it("No permite arrastrar fuera de los límites establecidos", () => {
    const onChangeRangeAction = jest.fn();
    const { getByRole } = render(
      <Range min={0} max={100} onChangeRangeAction={onChangeRangeAction} />
    );

    const sliderContainer = getByRole("slider");

    fireEvent.mouseDown(sliderContainer, { clientX: -10 });
    fireEvent.mouseMove(document, { clientX: -20 });
    fireEvent.mouseUp(document);

    fireEvent.mouseDown(sliderContainer, { clientX: 110 });
    fireEvent.mouseMove(document, { clientX: 120 });
    fireEvent.mouseUp(document);

    expect(onChangeRangeAction).not.toHaveBeenCalledWith(
      -1,
      expect.any(Number)
    );
    expect(onChangeRangeAction).not.toHaveBeenCalledWith(
      expect.any(Number),
      101
    );
  });

  it("Muestra 'Loading...' cuando la propiedad loading es true", () => {
    render(<Range min={0} max={100} loading={true} />);

    const loadingElement = screen.getByText("Loading...");
    expect(loadingElement).toBeInTheDocument();
  });

  it("Renderiza los componentes RangeLabel y Slider", () => {
    render(<Range min={0} max={100} loading={false} />);

    const minLabel = screen.getByText("0.00 €");
    const maxLabel = screen.getByText("100.00 €");
    expect(minLabel).toBeInTheDocument();
    expect(maxLabel).toBeInTheDocument();

    const sliderElement = screen.getByRole("slider");
    expect(sliderElement).toBeInTheDocument();
  });

  it("Permite la edición al hacer clic en una etiqueta del rango", () => {
    render(<Range min={0} max={100} loading={false} />);

    const minLabel = screen.getByText("0.00 €");
    expect(minLabel).toBeInTheDocument();

    fireEvent.click(minLabel);

    const minInput = screen.getByDisplayValue("0");
    expect(minInput).toBeInTheDocument();
    expect(minInput).toHaveAttribute("type", "number");

    const maxLabel = screen.getByText("100.00 €");
    expect(maxLabel).toBeInTheDocument();

    fireEvent.click(maxLabel);

    const maxInput = screen.getByDisplayValue("100");
    expect(maxInput).toBeInTheDocument();
    expect(maxInput).toHaveAttribute("type", "number");
  });

  it("Actualización de valores de mínimo y máximo al arrastrar", () => {
    const onChangeRangeAction = jest.fn();
    const { getByRole } = render(
      <Range min={0} max={100} onChangeRangeAction={onChangeRangeAction} />
    );

    const sliderContainer = getByRole("slider");

    fireEvent.mouseDown(sliderContainer, { clientX: 20 });
    fireEvent.mouseMove(document, { clientX: 40 });
    fireEvent.mouseUp(document);

    fireEvent.mouseDown(sliderContainer, { clientX: 80 });
    fireEvent.mouseMove(document, { clientX: 60 });
    fireEvent.mouseUp(document);

    expect(onChangeRangeAction).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number)
    );
    const [minValue, maxValue] = onChangeRangeAction.mock.calls[0];
    expect(minValue).toBeLessThan(maxValue);
    expect(minValue).toBeGreaterThanOrEqual(0);
    expect(maxValue).toBeLessThanOrEqual(100);
  });

  it("Validación de entradas incorrectas con alertas", () => {
    window.alert = jest.fn();

    const { getByText, getByDisplayValue } = render(
      <Range min={0} max={100} />
    );

    const minLabel = getByText("0.00 €");
    fireEvent.click(minLabel);

    const minInput = getByDisplayValue("0");
    fireEvent.change(minInput, { target: { value: "150" } });
    fireEvent.blur(minInput);

    expect(window.alert).toHaveBeenCalledWith("El valor mayor al esperado!");

    const maxLabel = getByText("100.00 €");
    fireEvent.click(maxLabel);

    const maxInput = getByDisplayValue("100");
    fireEvent.change(maxInput, { target: { value: "-10" } });
    fireEvent.blur(maxInput);

    expect(window.alert).toHaveBeenCalledWith("El valor menor al esperado!");
  });
});
