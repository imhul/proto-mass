import React, { memo, useCallback, } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";

// Components
import { Card, Row, Col, Form, Checkbox, Button, } from 'antd';
import Notify from '../../Output/Notify';
import SoundSlider from '../../Output/SoundSlider';

const FormItem = Form.Item;

const GameMenuEsc = memo(() => {

    // effects
    const history = useHistory();
    const dispatch = useDispatch();
    const { clickPosition } = useSelector(state => state.map);
    const { isFullscreen } = useSelector(state => state.stage);
    const { isGameMenuOpen, startGameForm, settings } = useSelector(state => state.game);

    // handlers
    const onLoadGame = useCallback(() => {
        console.warn("onLoadGame is run!");
    }, []);

    const onGameContinued = useCallback(() => {
        dispatch({ type: 'TOGGLE_GAME_MENU_ESC' });
        dispatch({ type: 'TOGGLE_PAUSE_GAME' });
    }, [dispatch]);

    const onSaveGame = useCallback(() => {
        dispatch({ 
            type: 'SAVE_GAME', 
            payload: { 
                units: [
                    {
                        id: '1001',
                        position: {
                            x: clickPosition.x,
                            y: clickPosition.y,
                        },
                    }
                ],
            },
        });
        Notify({
            type: "info",
            message: "Game Saved",
            icon: "save",
            duration: 3
        })
    }, [dispatch, clickPosition, ]);

    const onExitGame = useCallback(() => {
        dispatch({ type: 'EXIT_GAME' })
        history.push('/');
    }, [dispatch, history]);

    const onFullscreen = useCallback(checked => {
        if (!isFullscreen && checked) {
            dispatch({ type: 'FULLSCREEN', payload: true })
        } else {
            dispatch({ type: 'FULLSCREEN', payload: false })
        }
    }, [isFullscreen, dispatch]);

    return isGameMenuOpen ? (
        <Card className="game-modal start-game">

            <p className="hello">Hello, voyager!</p>

            <p className="hello">Wellcome{startGameForm.colonyName.length > 0 ? ` to ${startGameForm.colonyName}` : '!'}</p>

            <Form
                name="escGameForm"
                layout="vertical"
            >
                <FormItem
                    name="fullscreen" 
                    label="Expand to Fullscreen"
                    valuePropName="checked"
                    labelAlign="left"
                >
                    <Checkbox 
                        onChange={event => onFullscreen(event.target.checked)}
                    >
                        <span> { isFullscreen ? "Windowed" : "Fullscreen" }</span>
                    </Checkbox>
                </FormItem>
                <FormItem
                    name="volume" 
                    label={`Sound Volume Level is ${settings.volume} out of 1`}
                >
                    <SoundSlider showResult={false} />
                </FormItem>
            </Form>

            <Button
                block={true}
                onClick={() => onGameContinued()}
                className="game-btn"
            >
                Continue
            </Button>

            <Row gutter={16}>
                <Col span={8}>
                    <Button
                        onClick={() => onLoadGame()}
                        className="game-btn"
                        // loading={isLoadSavedGame}
                        block={true}
                    >
                        Load
                    </Button>
                </Col>
                <Col span={8}>
                    <Button
                        onClick={() => onSaveGame()}
                        className="game-btn"
                        // loading={isGameSaving}
                        block={true}
                    >
                        Save
                    </Button>
                </Col>
                <Col span={8}>
                    <Button
                        onClick={() => onExitGame()}
                        className="game-btn"
                        block={true}
                    >
                        Exit
                    </Button>
                </Col>
            </Row>

        </Card>
    ) : null
});

export default GameMenuEsc;
