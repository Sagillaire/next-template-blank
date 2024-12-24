import { useEffect, useRef, useState } from "react";
import { UseRangeLogicProps } from "../types";

export const useRange = ({
  min,
  max,
  isDecimal,
  onChangeRangeAction,
}: UseRangeLogicProps) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const [initialMin, setInitialMin] = useState(min);
  const [initialMax, setInitialMax] = useState(max);
  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDrag = (
    e: MouseEvent,
    type: "min" | "max",
    startValue: number
  ) => {
    if (!sliderRef.current) return;

    const sliderWidth = sliderRef.current.offsetWidth;
    const sliderLeft = sliderRef.current.getBoundingClientRect().left;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newPosition = Math.min(
        Math.max(moveEvent.clientX - sliderLeft, 0),
        sliderWidth
      );
      const rawValue =
        (newPosition / sliderWidth) * (initialMax - initialMin) + initialMin;
      const value = isDecimal
        ? Math.round(rawValue * 100) / 100 // Si es decimal, redondeamos a dos decimales
        : Math.round(rawValue); // Si no, redondeamos a entero

      if (
        type === "min" &&
        value <= maxValue - (isDecimal ? 0.01 : 1) &&
        value >= initialMin
      ) {
        setMinValue(value);
      } else if (
        type === "max" &&
        value >= minValue + (isDecimal ? 0.01 : 1) &&
        value <= initialMax
      ) {
        setMaxValue(value);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      if (onChangeRangeAction) onChangeRangeAction(minValue, maxValue);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleLabelClick = (type: "min" | "max") => {
    if (type === "min") {
      setIsEditingMin(true);
    } else {
      setIsEditingMax(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    const value = e.target.value;
    if (type === "min") {
      setMinValue(parseFloat(value) | 0);
    } else {
      setMaxValue(parseFloat(value) | 0);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "min" | "max",
    value: string
  ) => {
    if (e.key === "Enter") {
      handleInputBlur(type, value);
    }
  };

  const handleInputBlur = (type: "min" | "max", value: string) => {
    if (value === "") return; // Si está vacío no hacemos nada

    const parsedValue = isDecimal ? parseFloat(value) : parseInt(value, 10);

    if (type === "min") {
      if (parsedValue > maxValue) {
        alert("El valor mayor al esperado!");
        setInitialMin(min);
        setMinValue(min);
        return;
      } else {
        setInitialMin(parsedValue);
        setMinValue(parsedValue);
      }
      setIsEditingMin(false);
    } else if (type === "max") {
      if (parsedValue < minValue) {
        alert("El valor menor al esperado!");
        setInitialMax(max);
        setMaxValue(max);
        return;
      }
      setInitialMax(parsedValue);
      setMaxValue(parsedValue);
      setIsEditingMax(false);
    }
  };

  useEffect(() => {
    setMinValue(min);
    setMaxValue(max);
    setInitialMax(max);
    setInitialMin(min);
  }, [min, max]);

  return {
    handleLabelClick,
    isEditingMax,
    isEditingMin,
    minValue,
    maxValue,
    handleInputBlur,
    handleInputChange,
    handleKeyPress,
    initialMax,
    sliderRef,
    initialMin,
    handleDrag,
  };
};
