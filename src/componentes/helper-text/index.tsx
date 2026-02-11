import React from 'react';

import type { HelperControllerProps, HelperVariant, IHelperProps } from './propTypes';

const HelperText: React.FC<HelperControllerProps> = ({ attach }) => {
  const [message, setMessage] = React.useState<string | null | undefined>(null);
  const [variant, setVariant] = React.useState<HelperVariant>('info');

  const helper = React.useMemo<IHelperProps>(
    () => ({
      message,
      variant,
      set: (msg, v) => {
        setMessage(msg);
        if (v) {
          setVariant(v);
        }
      },
    }),
    [message, variant],
  );

  React.useEffect(() => {
    attach(helper);
  }, [helper, attach]);

  if (!message) {
    return null;
  }

  // Aqui você pode mudar a cor/classe conforme o variant
  const colorClass =
    variant === 'error'
      ? 'text-red-600 dark:text-red-400'
      : variant === 'warning'
        ? 'text-yellow-600 dark:text-yellow-400'
        : variant === 'success'
          ? 'text-green-600 dark:text-green-400'
          : 'text-gray-500 dark:text-gray-400';

  return <span className={`text-xs ${colorClass}`}>{message}</span>;
};

export default HelperText;
