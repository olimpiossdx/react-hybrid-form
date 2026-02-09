import React from 'react';

import type { SnackService, SnackVariant } from './services';
import Alert from '../alert'; // ou o seu componente de snack, se já existir

type FormSnackProps = {
  register: (svc: SnackService) => void;
};

const FormSnack: React.FC<FormSnackProps> = ({ register }) => {
  const [state, setState] = React.useState<{ message: string; variant: SnackVariant } | null>(null);

  React.useEffect(() => {
    const service: SnackService = {
      show: (msg, variant = 'info') => setState({ message: msg, variant }),
      hide: () => setState(null),
    };

    register(service);
  }, [register]);

  if (!state) {
    return null;
  }

  // Aqui você pode posicionar fixo (ex.: bottom-right) ou usar portal
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Alert
        variant={
          state.variant === 'error' ? 'error' : state.variant === 'success' ? 'success' : state.variant === 'warning' ? 'warning' : 'info'
        }>
        {state.message}
      </Alert>
    </div>
  );
};

export default FormSnack;
