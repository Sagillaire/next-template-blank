export type RangeProps = {
  min: number;
  max: number;
  loading?: boolean;
  isDecimal?: boolean;
  onChangeRangeAction?: (minValue: number, maxValue: number) => void;
};

export type TMode = "min" | "max";

export type UseRangeLogicProps = Omit<RangeProps, "loading">;

export type EditableLabelProps = {
  value: number;
  initialValue: number;
  isEditing: boolean;
  onClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>, value: string) => void;
  isDecimal: boolean;
};

export type RangeSliderProps = {
  minValue: number;
  maxValue: number;
  initialMin: number;
  initialMax: number;
  onDrag: (e: MouseEvent, type: TMode, startValue: number) => void;
};
