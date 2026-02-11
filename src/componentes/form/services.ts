export type alerVariant = 'info' | 'success' | 'warning' | 'error';

export type AlertService = {
  show: (message: string, variant?: alerVariant) => void;
  hide: () => void;
};

export type FormServices = {
  alert?: AlertService;
};
