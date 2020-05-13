import { useState, useEffect } from 'react';

function getDOM() {
    return { readyState: document.readyState };
}

function useDOMState() {
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

export default useDOMState;
