export interface IHelperProps {
  message: string | null | undefined;
  set: (message: string | null | undefined) => void;
}

export type HelperControllerProps = {
  attach: (helper: IHelperProps) => void;
};
