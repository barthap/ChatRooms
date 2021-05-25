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
