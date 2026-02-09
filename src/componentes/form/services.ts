export type SnackVariant = 'info' | 'success' | 'warning' | 'error';

export type AlertService = {
  show: (message: string, variant?: SnackVariant) => void;
  hide: () => void;
};

export type FormServices = {
  alert?: AlertService;
};
