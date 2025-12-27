export interface IStarRatingProps {
  name: string;
  label?: string;
  initialValue?: number;
  maxStars?: number;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  validationKey?: string;
  className?: string;
  starClassName?: string;
}
