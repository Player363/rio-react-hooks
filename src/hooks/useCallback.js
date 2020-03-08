import {useMemo} from './useMemo';

function useCallback(callback, dependent) {
  return useMemo(() => callback, dependent)
}

export {
  useCallback
};
