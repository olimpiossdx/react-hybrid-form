import React, { type JSX } from 'react';

import { cn } from '../../utils/cn';

type AsProp = keyof JSX.IntrinsicElements | React.ComponentType<any>;

export interface GridProps {
  as?: AsProp;
  cols?: number;
  mdCols?: number;
  lgCols?: number;
  gap?: number; // tokens
  gapRaw?: string; // ex: "gap-x-4 gap-y-2"
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
  [key: string]: any;
}

const Grid = React.forwardRef<any, GridProps>(({ as, cols, mdCols, lgCols, gap, gapRaw, align, justify, className, ...props }, ref) => {
  const Comp: any = as ?? 'div';

  const base = 'grid';

  const colClass = cols ? `grid-cols-${cols}` : '';
  const mdColClass = mdCols ? `md:grid-cols-${mdCols}` : '';
  const lgColClass = lgCols ? `lg:grid-cols-${lgCols}` : '';

  const gapClass = gap !== null ? `gap-${gap}` : '';
  const finalGapClass = gapRaw ?? gapClass;

  const alignClass =
    align === 'start'
      ? 'items-start'
      : align === 'center'
        ? 'items-center'
        : align === 'end'
          ? 'items-end'
          : align === 'stretch'
            ? 'items-stretch'
            : '';

  const justifyClass =
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

  return (
    <Comp ref={ref} className={cn(base, colClass, mdColClass, lgColClass, finalGapClass, alignClass, justifyClass, className)} {...props} />
  );
});

Grid.displayName = 'Grid';
export default Grid;
