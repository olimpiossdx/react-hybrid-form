import type { ValidationSeverity } from '../../utils/validate';

export type alerVariant = ValidationSeverity;

export type AlertService = {
  show: (message: string, variant?: alerVariant) => void;
  hide: () => void;
};

export type FormServices = {
  alert?: AlertService;
};
