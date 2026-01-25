import React, { type JSX } from 'react';

import { cn } from '../../utils/cn';

type AsProp = keyof JSX.IntrinsicElements | React.ComponentType<any>;

export interface BoxProps<T extends AsProp = 'div'> {
  as?: T;
  className?: string;
  // permite qualquer prop do elemento/componente alvo
  [key: string]: any;
}

export const Box = React.forwardRef<any, BoxProps>(({ as, className, ...props }, ref) => {
  const Comp: any = as ?? 'div';
  return <Comp ref={ref} className={cn(className)} {...props} />;
});

Box.displayName = 'Box';
export default Box;
