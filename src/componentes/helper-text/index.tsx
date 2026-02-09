import React from 'react';

import type { IHelperProps } from './propTypes';

type HelperControllerProps = {
  attach: (helper: IHelperProps) => void;
};

const HelperText: React.FC<HelperControllerProps> = ({ attach }) => {
  const [message, setMessage] = React.useState<string | null | undefined>(null);

  const helper = React.useMemo<IHelperProps>(
    () => ({
      message,
      set: (msg) => setMessage(msg),
    }),
    [message],
  );

  React.useEffect(() => {
    attach(helper);
  }, [helper, attach]);

  if (!message) {
    return null;
  }

  return <span className="text-xs text-gray-500">{message}</span>;
};

export default HelperText;
