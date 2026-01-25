import * as React from 'react';

import { cn } from '../../utils/cn';

type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: React.ElementType;
  level?: HeadingLevel;
  align?: 'left' | 'center' | 'right';
}

const Heading: React.FC<HeadingProps> = ({ as, level = 2, align = 'left', className, ...props }) => {
  const Tag: any = as ?? (`h${level}` as any);

  const sizeClass = level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : level === 3 ? 'text-xl' : 'text-lg';

  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return <Tag className={cn('font-bold text-gray-800 dark:text-white', sizeClass, alignClass, className)} {...props} />;
};
export default Heading;
