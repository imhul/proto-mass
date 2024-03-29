import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Selectors
import { isFullscreenSelector } from '../../../selectors/stage';
import { isTimeMachineInitSelector } from '../../../selectors/time';
import {
    isGameInitSelector,
    gameSettingsSelector,
    isLoadSavedGameSelector
} from '../../../selectors/game';

// Components
import { Card, Row, Col, Form, Input, Checkbox, Button } from 'antd';
import SoundSlider from '../../Output/SoundSlider';

// Utils
import { v5 as uuidv5 } from 'uuid';

const FormItem = Form.Item;

const StartInfo = memo(() => {
    // effects
    const history = useHistory();
    const dispatch = useDispatch();
    const isFullscreen = useSelector(isFullscreenSelector);
    const isTimeMachineInit = useSelector(isTimeMachineInitSelector);
    const isGameInit = useSelector(isGameInitSelector);
    const isLoadSavedGame = useSelector(isLoadSavedGameSelector);
    const gameSettings = useSelector(gameSettingsSelector);
    const [colonyName, setColonyName] = useState('Autopia');
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [startFormFields, setStartFormFields] = useState([
        {
            name: 'colonyName',
            value: colonyName
        }
    ]);

    // handlers
    const onFirstClick = useCallback(() => {
        if (isFirstClick) {
            setIsFirstClick(false);
            setColonyName('');
            setStartFormFields([
                {
                    name: 'colonyName',
                    value: ''
                }
            ]);
        }
    }, [isFirstClick, setIsFirstClick, setColonyName, setStartFormFields]);

    const onLoadGame = useCallback(() => {
        console.warn('onLoadGame is run!');
    }, []);

    const onExitGame = useCallback(() => {
        dispatch({ type: 'EXIT_GAME' });
        history.push('/');
    }, [dispatch, history]);

    const onStartGame = useCallback(() => {
        if (!isTimeMachineInit && isGameInit) {
            dispatch({ type: 'START_GAME' });
            dispatch({ type: 'TIME_MACHINE_INIT' });
            dispatch({ type: 'START_INFO_MODAL_CLOSE' });
            if (startFormFields.length > 0) {
                const idLength = new Array(16);
                const colonyNameInput = startFormFields.find(
                    input => input.name[0] === 'colonyName'
                );
                const colonyNewName =
                    colonyNameInput && colonyNameInput.value && colonyNameInput.value.length > 0
                        ? colonyNameInput.value
                        : colonyName;
                const colonyId = uuidv5(colonyNewName, idLength);

                dispatch({
                    type: 'START_GAME_FORM_UPDATE',
                    payload: {
                        colony: {
                            id: colonyId,
                            level: 0,
                            name: colonyNewName
                        }
                    }
                });
            }
        }
    }, [isTimeMachineInit, isGameInit, startFormFields, dispatch, colonyName]);

    const setFullscreen = useCallback(
        checked => {
            if (!isFullscreen && checked) {
                dispatch({ type: 'FULLSCREEN', payload: true });
            } else {
                dispatch({ type: 'FULLSCREEN', payload: false });
            }
        },
        [isFullscreen, dispatch]
    );

    return (
        <Card className="game-modal start-game">
            <p className="hello">Hello, voyager!</p>

            <p className="hello">Wellcome{colonyName.length > 0 ? ` to ${colonyName}` : '!'}</p>

            <Form
                name="startGameForm"
                fields={startFormFields}
                layout="vertical"
                onFieldsChange={(changedFields, allFields) => {
                    setStartFormFields(allFields);
                }}
            >
                <FormItem
                    name="colonyName"
                    label="Colony Name"
                    onChange={event => setColonyName(event.target.value)}
                    onClick={e => onFirstClick(e)}
                    rules={[
                        {
                            required: true,
                            message: 'Colony Name is required!'
                        },
                        {
                            max: 20,
                            message: 'Max Colony Name length is 20 chars max!'
                        }
                    ]}
                >
                    <Input autoComplete="off" />
                </FormItem>
                <FormItem
                    name="fullscreen"
                    label="Expand to Fullscreen"
                    valuePropName="checked"
                    labelAlign="left"
                >
                    <Checkbox onChange={event => setFullscreen(event.target.checked)}>
                        <span> {isFullscreen ? 'Windowed' : 'Fullscreen'}</span>
                    </Checkbox>
                </FormItem>
                <FormItem
                    name="volume"
                    label={`Sound Volume Level is ${gameSettings.volume} out of 1`}
                >
                    <SoundSlider showResult={false} />
                </FormItem>
            </Form>

            <Button block={true} onClick={() => onStartGame()} className="game-btn">
                Start
            </Button>

            <Row gutter={16}>
                <Col span={12}>
                    <Button
                        onClick={() => onLoadGame()}
                        className="game-btn"
                        loading={isLoadSavedGame}
                        block={true}
                    >
                        Load Game
                    </Button>
                </Col>
                <Col span={12}>
                    <Button onClick={() => onExitGame()} className="game-btn" block={true}>
                        Exit Game
                    </Button>
                </Col>
            </Row>
        </Card>
    );
});

export default StartInfo;
