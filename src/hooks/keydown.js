import { useState, useEffect, useCallback } from "react";

export default function useKeydown() {
    const [keysPressed, setKeyPressed] = useState(new Set([]));

    const onKeyDown = useCallback(({ key }) => {
        setKeyPressed(keysPressed.add(key));
    }, [keysPressed]);

    const onKeyUp = useCallback(({ key }) => {
        keysPressed.delete(key);
        setKeyPressed(keysPressed);
    }, [keysPressed]);

    useEffect(() => {
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyUp, onKeyDown]);

  return keysPressed;
}
