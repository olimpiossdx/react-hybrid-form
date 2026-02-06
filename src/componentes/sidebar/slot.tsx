import React from 'react';

import { cn } from '../../utils/cn';

type SlotProps = { children: React.ReactElement; className?: string } & Omit<
  React.HTMLAttributes<HTMLElement>,
  'onCopy' | 'onCut' | 'onPaste'
>;

function Slot({ children, className, ...rest }: SlotProps) {
  if (!React.isValidElement(children)) {
    if (import.meta.env.DEV) {
      console.warn('Slot expects a single valid ReactElement as child.');
    }
    return null;
  }

  const childProps: any = children.props ?? {};
  const mergedClassName = cn(childProps.className, className);

  return React.cloneElement(children, { ...rest, ...childProps, className: mergedClassName });
}

export { Slot };
