import React from 'react';
import { useDispatch } from 'react-redux';
import { Layout } from 'antd';

// Utils
import WindowSizeListener from 'react-window-size-listener';

const HomePage = () => {
    const dispatch = useDispatch();

    return (
        <WindowSizeListener
            onResize={output =>
                dispatch({
                    type: 'RESIZE',
                    payload: output,
                    meta: false
                })
            }
        >
            <Layout>
                <h1 className="hero">proto-mass</h1>
            </Layout>
        </WindowSizeListener>
    );
};

export default HomePage;
