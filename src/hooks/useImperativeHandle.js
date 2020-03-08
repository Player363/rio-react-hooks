import {useEffect} from './useEffect';

function useImperativeHandle(ref, creator, dependent) {
  useEffect(
    () => {
      if (typeof ref === 'function') {
        const instances = creator();
        ref(instances);
        // 解除副作用
        return () => ref(null);
      } else {
        const instances = creator();
        ref.current = instances;
        return () => ref.current = null;
      }
    },
    dependent == null ? null : dependent.concat(ref)
  );
}

export {
  useImperativeHandle
};
