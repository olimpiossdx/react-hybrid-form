import React from 'react';

import Flex, { type FlexProps } from '../flex';

export interface StackProps extends Omit<FlexProps, 'direction' | 'gap'> {
  spacing?: number; // tokens recomendados
  gapRaw?: string; // override total se precisar
}

export const Stack = React.forwardRef<any, StackProps>(({ spacing = 4, gapRaw, ...props }, ref) => {
  return <Flex ref={ref} direction="col" gap={gapRaw ? undefined : spacing} gapRaw={gapRaw} {...props} />;
});

Stack.displayName = 'Stack';
