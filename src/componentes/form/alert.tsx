import React from 'react';

import type { AlertService, alerVariant } from './services';
import Alert from '../alert';

type FormAlertProps = {
  register: (svc: AlertService) => void;
};

const FormAlert: React.FC<FormAlertProps> = ({ register }) => {
  const [message, setMessage] = React.useState<string | null>(null);
  const [variant, setVariant] = React.useState<alerVariant>('error');

  React.useEffect(() => {
    const service: AlertService = {
      show: (msg, v) => {
        setMessage(msg);
        setVariant(v ?? 'error');
      },
      hide: () => setMessage(null),
    };

    register(service);
  }, [register]);

  if (!message) {
    return null;
  }

  return (
    <div className="mb-3">
      <Alert
        variant={variant}
        title="Problemas encontrados"
        onClose={() => setMessage(null)} // permite o usuário fechar
      >
        {message}
      </Alert>
    </div>
  );
};

FormAlert.displayName = 'FormAlert';

export default FormAlert;
