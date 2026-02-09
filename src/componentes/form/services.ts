export type SnackVariant = 'info' | 'success' | 'warning' | 'error';

export type AlertService = {
  show: (message: string) => void;
  hide: () => void;
};

export type SnackService = {
  show: (message: string, variant?: SnackVariant) => void;
  hide: () => void;
};

export type FormServices = {
  alert?: AlertService;
  snack?: SnackService;
};
