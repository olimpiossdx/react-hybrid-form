import React, { type JSX } from 'react';

import { cn } from '../../utils/cn';

type AsProp = keyof JSX.IntrinsicElements | React.ComponentType<any>;

export interface FlexProps<T extends AsProp = 'div'> {
  as?: T;
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  wrap?: boolean;
  gap?: number;
  gapRaw?: string;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
  [key: string]: any;
}

const Flex = React.forwardRef<any, FlexProps>(
  ({ as, direction = 'row', wrap = false, gap, gapRaw, align, justify, inline, className, ...props }, ref) => {
    const Comp: any = as ?? 'div';
    const base = inline ? 'inline-flex' : 'flex';

    const dirClass: string =
      direction === 'row'
        ? 'flex-row'
        : direction === 'row-reverse'
          ? 'flex-row-reverse'
          : direction === 'col'
            ? 'flex-col'
            : 'flex-col-reverse';

    const wrapClass = wrap ? 'flex-wrap' : 'flex-nowrap';

    const gapClass = gap !== null ? `gap-${gap}` : '';
    const finalGapClass = gapRaw ?? gapClass;

    const alignClass: string =
      align === 'start'
        ? 'items-start'
        : align === 'center'
          ? 'items-center'
          : align === 'end'
            ? 'items-end'
            : align === 'baseline'
              ? 'items-baseline'
              : align === 'stretch'
                ? 'items-stretch'
                : '';

    const justifyClass: string =
      justify === 'start'
        ? 'justify-start'
        : justify === 'center'
          ? 'justify-center'
          : justify === 'end'
            ? 'justify-end'
            : justify === 'between'
              ? 'justify-between'
              : justify === 'around'
                ? 'justify-around'
                : justify === 'evenly'
                  ? 'justify-evenly'
                  : '';

    return <Comp ref={ref} className={cn(base, dirClass, wrapClass, finalGapClass, alignClass, justifyClass, className)} {...props} />;
  },
);
export default Flex;
