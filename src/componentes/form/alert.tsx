import React from 'react';

import type { AlertService } from './services';
import Alert from '../alert'; // seu componente de alerta [file:13]

type FormAlertProps = {
  register: (svc: AlertService) => void;
};

const FormAlert: React.FC<FormAlertProps> = ({ register }) => {
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const service: AlertService = {
      show: (msg) => setMessage(msg),
      hide: () => setMessage(null),
    };

    register(service);
  }, [register]);

  if (!message) {
    return null;
  }

  return (
    <div className="mb-3">
      <Alert variant="error" title="Problemas encontrados:" onClose={() => setMessage(null)}>
        {message}
      </Alert>
    </div>
  );
};

export default FormAlert;
