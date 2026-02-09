import React from 'react';

import type { IInputProps } from '../input';

export type FormRegistryContextValue = {
  registerFieldRef: (name: string, ref: IInputProps | null) => void;
};

export const FormRegistryContext = React.createContext<FormRegistryContextValue | null>(null);

export const useFormRegistry = () => {
  const ctx = React.useContext(FormRegistryContext);
  if (!ctx) {
    throw new Error('useFormRegistry must be used inside <Form>');
  }
  return ctx;
};
