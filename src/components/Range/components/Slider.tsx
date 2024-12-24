import React, { RefObject } from "react";
import { formatValue } from "utils/formatValue";
import styles from "../Range.module.css";
import { TMode } from "../types";

type Props = {
  minValue: number;
  maxValue: number;
  initialMin: number;
  initialMax: number;
  isEditingMax: boolean;
  isEditingMin: boolean;
  sliderRef: RefObject<HTMLDivElement>;
  handleDrag: (event: MouseEvent, mode: TMode, value: number) => void;
};

export const Slider: React.FC<Props> = ({
  minValue,
  maxValue,
  initialMin,
  initialMax,
  isEditingMax,
  isEditingMin,
  handleDrag,
  sliderRef,
}) => {
  return (
    <div className={styles.sliderContainer} ref={sliderRef}>
      <div
        className={`${styles.track} ${(isEditingMax || isEditingMin) && styles.hidden}`}
        style={{
          left: `${((minValue - initialMin) / (initialMax - initialMin)) * 100}%`,
          right: `${100 - ((maxValue - initialMin) / (initialMax - initialMin)) * 100}%`,
        }}
      >
        <span className={styles.trackLabel}>{`${formatValue(minValue)}`}</span>
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
        role="slider"
      >
        <span className={styles.trackLabelMax}>
          {`${formatValue(maxValue)}`}
        </span>
      </div>
    </div>
  );
};
