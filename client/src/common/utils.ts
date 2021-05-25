import React from 'react';

// use async operation with automatic abortion on unmount
export function useAsync<TResultType>(
  asyncFn: (...args: any[]) => Promise<TResultType>,
  onSuccess: (result: TResultType) => void
) {
  React.useEffect(() => {
    let isMounted = true;
    asyncFn().then(data => {
      if (isMounted) onSuccess(data);
    });
    return () => {
      isMounted = false;
    };
  }, [asyncFn]);
}

/**
 * Unix timestamp to locale hour (HH:mm:ss in Europe)
 */
export function timestampToLocaleTime(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString();
}
