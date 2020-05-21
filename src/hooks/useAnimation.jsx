import { useRef, useEffect } from 'react';

const useAnimation = callback => {

    const requestRef = useRef();
    const previousTimeRef = useRef();
    
    const animate = time => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime)
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }, []);
}

export default useAnimation;