import { browser } from '$app/env';
import { writable } from 'svelte/store';

import type { Writable } from 'svelte/store';

export function persistStore<T>(
  name: string,
  initialValue: T | null = null,
): Pick<Writable<T | null>, 'subscribe' | 'set'> {
  let initialStoreValue = initialValue;
  if (browser) {
    try {
      if (window?.localStorage?.getItem(name)) {
        initialStoreValue = JSON.parse(window?.localStorage?.getItem(name));
      }
    } catch (_err) {
      initialStoreValue = null;
    }
  }

  const { subscribe, set } = writable<T>(initialStoreValue);

  return {
    subscribe,

    set: (x: T | null) => {
      if (browser) {
        if (x === null) {
          window?.localStorage?.removeItem(name);
        } else {
          window?.localStorage?.setItem(name, JSON.stringify(x));
        }
      }
      set(x);
    },
  };
}
