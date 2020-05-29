import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Card, Button } from 'antd';

const StartInfo = () => {

    const dispatch = useDispatch();
    const { isTimeMachineInit } = useSelector(state => state.time);
    const { isGameInit } = useSelector(state => state.game);

    const onStartGame = useCallback(() => {
        if (!isTimeMachineInit && isGameInit) {
            dispatch({ type: 'TIME_MACHINE_INIT' });
            dispatch({ type: 'START_INFO_MODAL_CLOSE' });
        }
    }, [ isTimeMachineInit, isGameInit, dispatch ]);

    return (
        <Card className="game-modal">
            <p className="hello">Hello, voyager!</p>

            <p className="info">Start Game Information</p>

            <Button onClick={() => onStartGame()}>Start</Button>
        </Card>
    );
}

export default StartInfo;
