import { useState, useEffect } from 'react';

function getDOM() {
    return { readyState: document.readyState };
}

export const useDOMState = () => {
    const [readyState, setReadyState] = useState(getDOM());

    function handleDOM() {
        setReadyState(getDOM());
    }

    useEffect(() => {
        document.addEventListener('DOMContentLoaded', handleDOM);
        
        return () => {
            document.removeEventListener('DOMContentLoaded', handleDOM)
        }
    }, []);

    return readyState;
};
