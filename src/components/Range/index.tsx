"use client";
import styles from "./Range.module.css";
import { RangeLabel, Slider } from "./components";
import { useRange } from "./hooks/useRange";

type Props = {
  min: number;
  max: number;
  loading?: boolean;
  isDecimal?: boolean;
  onChangeRangeAction?: (minValue: number, maxValue: number) => void;
};

export const Range: React.FC<Props> = ({
  min,
  max,
  loading,
  isDecimal = true,
  onChangeRangeAction,
}) => {
  const {
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
  } = useRange({ min, max, isDecimal, onChangeRangeAction });

  if (loading) {
    return <h3 className="loadingData">Loading...</h3>;
  }

  return (
    <div className={styles.container}>
      <RangeLabel
        mode="min"
        value={minValue}
        isEditing={isEditingMin}
        initialValue={initialMin}
        handleKeyPress={handleKeyPress}
        handleInputBlur={handleInputBlur}
        handleLabelClick={handleLabelClick}
        handleInputChange={handleInputChange}
      />

      <Slider
        maxValue={maxValue}
        minValue={minValue}
        sliderRef={sliderRef}
        handleDrag={handleDrag}
        initialMax={initialMax}
        initialMin={initialMin}
        isEditingMax={isEditingMax}
        isEditingMin={isEditingMin}
      />

      <RangeLabel
        mode="max"
        value={maxValue}
        isEditing={isEditingMax}
        initialValue={initialMax}
        handleKeyPress={handleKeyPress}
        handleInputBlur={handleInputBlur}
        handleLabelClick={handleLabelClick}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};
