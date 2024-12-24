import { formatValue } from "utils/formatValue";
import styles from "../Range.module.css";
import { TMode } from "../types";

interface Props {
  mode: TMode;
  value: number;
  isEditing: boolean;
  initialValue: number;
  handleLabelClick: (mode: TMode) => void;
  handleInputBlur: (type: TMode, value: string) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: TMode
  ) => void;
  handleKeyPress: (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: TMode,
    value: string
  ) => void;
}

export const RangeLabel = ({
  mode,
  value,
  isEditing,
  initialValue,
  handleKeyPress,
  handleInputBlur,
  handleLabelClick,
  handleInputChange,
}: Props) => {
  return (
    <div>
      <span
        className={styles.valueLabel}
        onClick={() => handleLabelClick(mode)}
      >
        {isEditing ? (
          <input
            className={styles.inputLabel}
            type="number"
            value={value}
            onChange={(e) => handleInputChange(e, mode)}
            onBlur={() => handleInputBlur(mode, value.toString())}
            onKeyPress={(e) => handleKeyPress(e, mode, value.toString())}
            autoFocus
          />
        ) : (
          `${formatValue(initialValue)} €`
        )}
      </span>
    </div>
  );
};
