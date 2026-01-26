import React from 'react';

export type ListRowProps<T> = {
  internalId: string;
  index: number;
  data: T;
  onChange: (patch: Partial<T>) => void;
  onRemove: () => void;
};

export type ListRowComponent<T> = React.ComponentType<ListRowProps<T>>;

const createRowComponent = React.useCallback(
  (
    Component: ListRowComponent<T>,
    options?: {
      areEqual?: (prev: ListRowProps<T>, next: ListRowProps<T>) => boolean;
    },
  ) => {
    if (options?.areEqual) {
      return React.memo(Component, options.areEqual);
    }
    return React.memo(Component);
  },
  [],
);
export default createRowComponent;
