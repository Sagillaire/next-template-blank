"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Range.module.css";

type Props = {
  min: number;
  max: number;
  loading?: boolean;
  isDecimal?: boolean; // Nueva propiedad para manejar decimales
  onChangeRangeAction?: (minValue: number, maxValue: number) => void;
};

export const Range: React.FC<Props> = ({
  min,
  max,
  loading,
  isDecimal = true, // Valor predeterminado
  onChangeRangeAction,
}) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const [initialMin, setInitialMin] = useState(min);
  const [initialMax, setInitialMax] = useState(max);
  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  console.log({ maxValue });

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

  const formatValue = (value: number) => {
    return isDecimal ? value.toFixed(2) : value.toString();
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

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.container}>
      <div>
        <span
          className={styles.valueLabel}
          onClick={() => handleLabelClick("min")}
        >
          {isEditingMin ? (
            <input
              className={styles.inputLabel}
              type="number"
              value={minValue}
              onChange={(e) => handleInputChange(e, "min")}
              onBlur={() => handleInputBlur("min", minValue.toString())}
              onKeyPress={(e) => handleKeyPress(e, "min", minValue.toString())}
              autoFocus
            />
          ) : (
            `${formatValue(initialMin)} €`
          )}
        </span>
      </div>

      <div className={styles.sliderContainer} ref={sliderRef}>
        <div
          className={`${styles.track} ${(isEditingMax || isEditingMin) && styles.hidden}`}
          style={{
            left: `${((minValue - initialMin) / (initialMax - initialMin)) * 100}%`,
            right: `${100 - ((maxValue - initialMin) / (initialMax - initialMin)) * 100}%`,
          }}
        >
          <span className={styles.trackLabel}>
            {`${formatValue(minValue)}`}
          </span>
        </div>
        <div
          className={styles.thumb}
          style={{
            left: `${((minValue - initialMin) / (initialMax - initialMin)) * 100}%`,
          }}
          onMouseDown={(e) =>
            handleDrag(e as unknown as MouseEvent, "min", minValue)
          }
        ></div>
        <div
          className={styles.thumb}
          style={{
            left: `${((maxValue - initialMin) / (initialMax - initialMin)) * 100}%`,
          }}
          onMouseDown={(e) =>
            handleDrag(e as unknown as MouseEvent, "max", maxValue)
          }
        >
          <span className={styles.trackLabelMax}>
            {`${formatValue(maxValue)}`}
          </span>
        </div>
      </div>

      <div>
        <span
          className={styles.valueLabel}
          onClick={() => handleLabelClick("max")}
        >
          {isEditingMax ? (
            <input
              className={styles.inputLabel}
              type="number"
              value={maxValue}
              onChange={(e) => handleInputChange(e, "max")}
              onBlur={() => handleInputBlur("max", maxValue.toString())}
              onKeyPress={(e) => handleKeyPress(e, "max", maxValue.toString())}
              autoFocus
            />
          ) : (
            `${formatValue(initialMax)} €`
          )}
        </span>
      </div>
    </div>
  );
};
