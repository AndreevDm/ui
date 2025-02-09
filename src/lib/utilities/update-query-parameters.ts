import { browser } from '$app/env';
import type { goto, invalidate } from '$app/navigation';

type UpdateQueryParams = {
  parameter: string;
  value?: string | number | boolean;
  url: URL;
  goto: typeof goto;
  allowEmpty?: boolean;
  invalidate?: typeof invalidate;
};

export const gotoOptions = {
  replaceState: true,
  keepfocus: true,
  noscroll: true,
};

export const updateQueryParameters = async ({
  parameter,
  value,
  url,
  goto,
  allowEmpty = false,
}: UpdateQueryParams): Promise<typeof value> => {
  const next = String(value);

  if (value) {
    url.searchParams.set(parameter, next);
  } else if (allowEmpty) {
    url.searchParams.set(parameter, '');
  } else {
    url.searchParams.delete(parameter);
  }

  if (browser && url.href !== window.location.href) {
    goto(String(url), gotoOptions);
  }

  return value;
};
