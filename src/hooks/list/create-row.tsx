import React from "react";

// dentro do arquivo do useList.ts
export type ListRowProps<T> = {
  internalId: string;
  index: number;
  data: T;
  onChange: (patch: Partial<T>) => void;
  onRemove: () => void;
};

export type ListRowComponent<T> = React.ComponentType<ListRowProps<T>>;

function createRowComponent<T>(
  Component: ListRowComponent<T>,
  options?: {
    areEqual?: (prev: ListRowProps<T>, next: ListRowProps<T>) => boolean;
  },
): React.MemoExoticComponent<ListRowComponent<T>> {
  if (options?.areEqual) {
    return React.memo(Component, options.areEqual);
  }
  return React.memo(Component);
}
export default createRowComponent