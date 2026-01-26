import React from 'react';

import { useGraphBus } from '../native-bus';

interface ListDirtyEvent {
  'list:dirty': { listId?: string; isDirty: boolean };
}

export const useListDirty = (listId?: string) => {
  const { on } = useGraphBus<ListDirtyEvent>();
  const [isDirty, setIsDirty] = React.useState(false);

  React.useEffect(() => {
    return on('list:dirty', ({ listId: id, isDirty }) => {
      if (!listId || id === listId) {
        setIsDirty(isDirty);
      }
    });
  }, [listId, on]);

  return isDirty;
};
