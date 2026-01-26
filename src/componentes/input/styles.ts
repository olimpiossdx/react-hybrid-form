// componentes/input/styles.ts
import type { InputProps } from './index';
import { cn } from '../../utils/cn';

type Variant = NonNullable<InputProps['variant']>;
type Size = NonNullable<InputProps['size']>;

export const baseInputClasses =
  'w-full transition-all duration-200 px-1 ' +
  'placeholder:text-gray-400 dark:placeholder:text-gray-500 ' +
  'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ' +
  'focus:outline-none text-gray-900 dark:text-white';

export function getVariantClasses(variant: Variant): { input: string; floatingLabelActive: string } {
  if (variant === 'filled') {
    return {
      input: cn(
        'bg-gray-100 dark:bg-gray-800',
        'border-b-2 border-gray-300 dark:border-gray-600 border-t-0 border-l-0 border-r-0',
        'rounded-t-md rounded-b-none',
        'hover:bg-gray-200 dark:hover:bg-gray-700',
        'focus:bg-gray-200 dark:focus:bg-gray-700',
        'focus:border-blue-600 dark:focus:border-blue-500',
      ),
      floatingLabelActive: cn(
        'peer-focus:top-1 peer-focus:translate-y-0 peer-focus:scale-75',
        'peer-[:not(:placeholder-shown)]:top-1',
        'peer-[:not(:placeholder-shown)]:translate-y-0',
        'peer-[:not(:placeholder-shown)]:scale-75',
      ),
    };
  }

  if (variant === 'ghost') {
    return {
      input: cn(
        'bg-transparent border border-transparent rounded-md',
        'hover:bg-gray-50 dark:hover:bg-gray-800/30',
        'focus:bg-white dark:focus:bg-gray-800',
        'focus:shadow-sm focus:ring-2 focus:ring-blue-500',
      ),
      floatingLabelActive: cn(
        'peer-focus:-top-2 peer-focus:-translate-y-0 peer-focus:scale-75',
        'peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1',
        'peer-[:not(:placeholder-shown)]:-top-2',
        'peer-[:not(:placeholder-shown)]:-translate-y-0',
        'peer-[:not(:placeholder-shown)]:scale-75',
        'peer-[:not(:placeholder-shown)]:bg-white',
        'dark:peer-[:not(:placeholder-shown)]:bg-gray-800',
        'peer-[:not(:placeholder-shown)]:px-1',
      ),
    };
  }

  // outlined (default)
  return {
    input: cn(
      'bg-transparent',
      'border border-gray-400 dark:border-gray-500 rounded-md',
      'hover:border-gray-600 dark:hover:border-gray-400',
      'focus:border-blue-600 focus:ring-1 focus:ring-blue-600',
    ),
    floatingLabelActive: cn(
      'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75',
      'peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1',
      'peer-[:not(:placeholder-shown)]:top-0',
      'peer-[:not(:placeholder-shown)]:-translate-y-1/2',
      'peer-[:not(:placeholder-shown)]:scale-75',
      'peer-[:not(:placeholder-shown)]:bg-white',
      'dark:peer-[:not(:placeholder-shown)]:bg-gray-800',
      'peer-[:not(:placeholder-shown)]:px-1',
    ),
  };
}

export function getSizeClasses(size: Size, opts: { variant: Variant; floatingLabel: boolean }): string {
  const { variant, floatingLabel } = opts;

  if (variant === 'filled' && floatingLabel) {
    if (size === 'sm') {
      return 'pt-4 pb-0 text-xs h-8';
    }
    if (size === 'lg') {
      return 'pt-7 pb-2 text-lg h-16';
    }
    return 'pt-6 pb-2 text-base h-14';
  }

  // padrão
  if (size === 'sm') {
    return 'py-1 text-xs h-8';
  }
  if (size === 'lg') {
    return 'py-3 text-lg h-12';
  }
  return 'py-1.5 text-base h-11';
}

export function getIconPadding(hasLeft: boolean, hasRight: boolean): string {
  return cn(hasLeft && 'pl-7', hasRight && 'pr-7');
}

export const invalidStateClasses = cn(
  'data-[invalid=true]:border-red-500',
  'data-[invalid=true]:text-red-900',
  'data-[invalid=true]:focus:border-red-500',
  'data-[invalid=true]:focus:ring-red-500',
  'data-[invalid=true]:placeholder:text-red-300',
);

export function getCheckboxRadioClasses(type: string): string {
  const shapeClass = type === 'radio' ? 'rounded-full' : 'rounded';
  return cn('w-5 h-5', 'text-blue-600', 'border-gray-300', shapeClass, 'focus:ring-blue-500', 'cursor-pointer', 'accent-blue-600');
}
