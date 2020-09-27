import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux'; // useSelector
import { useHistory } from "react-router-dom";

// Components
import { Card, Button } from 'antd';
import Notify from '../../Output/Notify';

// utils
// import _ from 'lodash';

const StartOrLoadModal = memo(() => {

    const history = useHistory();
    const dispatch = useDispatch();
    // const { user } = useSelector(state => state.auth);
    // const { save } = useSelector(state => state.game);

    const onLoadSavedGame = useCallback(() => {
        // if (_.isEmpty(save) && !_.isEmpty(user.save)) {
        //     dispatch({
        //         type: 'LOAD_GAME_SAVE',
        //         payload: user.save
        //     });
        // }
        // dispatch({ type: 'START_OR_LOAD_MODAL_CLOSE' })
        Notify({
            type: "info",
            message: "Coming soon!",
            icon: "info",
            duration: 4
        })
    }, []); // dispatch, user.save, save

    const onStartNewGame = useCallback(() => {
        dispatch({ type: 'SINTHESIZE_NEW_GAME' });
        dispatch({ type: 'START_OR_LOAD_MODAL_CLOSE' });
    }, [dispatch]);

    const onExitGame = useCallback(() => {
        dispatch({ type: 'START_OR_LOAD_MODAL_CLOSE' });
        dispatch({ type: 'EXIT_GAME' });
        history.push('/')
    }, [history, dispatch]);

    return (
        <Card className="game-modal">
            <p className="hello">Hello, voyager!</p>

            <Button 
                block={true}
                className="game-btn"
                onClick={() => onStartNewGame()}
            >
                Start New Game
            </Button>

            <Button
                block={true}
                className="game-btn"
                onClick={() => onLoadSavedGame()}
            >
                Load Saved Game
            </Button>

            <Button
                block={true}
                className="game-btn"
                onClick={() => onExitGame()}
            >
                Exit Game
            </Button>
            {/* <Button
                block={true}
                className="game-btn"
                href="https://github.com/imhul/proto-mass"
            >
                About
            </Button>
            <Button
                block={true}
                className="game-btn"
                href="https://www.patreon.com/protomass"
            >
                Donate
            </Button> */}
        </Card>
    )
});

export default StartOrLoadModal;
