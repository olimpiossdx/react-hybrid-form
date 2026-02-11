export type HelperVariant = 'info' | 'warning' | 'error' | 'success' | 'neutral';

export interface IHelperProps {
  message: string | null | undefined;
  variant: HelperVariant;
  set: (message: string | null | undefined, variant?: HelperVariant) => void;
}

export type HelperControllerProps = {
  attach: (helper: IHelperProps) => void;
};
