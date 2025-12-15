import type { ExistingFile } from "../../utils/fileUtils";

export interface IFileInputProps {
  name: string;
  label?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  initialFiles?: ExistingFile[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  "data-validation"?: string;
}