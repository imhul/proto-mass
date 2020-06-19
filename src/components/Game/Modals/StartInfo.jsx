import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Card, Form, Input, Button } from 'antd';

const FormItem = Form.Item;

const StartGameForm = memo(({ onChange, fields }) => {

    const [colonyName, setColonyName] = useState("Autopia");

    return (
        <>
            <p className="hello">Wellcome{colonyName.length > 0 ?  ` to ${colonyName}` : '!'}</p>
            <Form
                name="startGameForm"
                fields={fields}
                layout="vertical"
                onFieldsChange={(changedFields, allFields) => {
                    onChange(allFields);
                }}
            >
                <FormItem
                    name="colonyName"
                    label="Colony Name"
                    onChange={event => setColonyName(event.target.value)}
                    rules={[
                        {
                            required: true,
                            message: 'Colony Name is required!',
                        },
                    ]}
                >
                    <Input />
                </FormItem>
            </Form>
        </>
    )
});

const StartInfo = memo(() => {

    const dispatch = useDispatch();
    const { isTimeMachineInit } = useSelector(state => state.time);
    const { isGameInit } = useSelector(state => state.game);
    const [startForm, setStartForm] = useState([
        {
            name: "colonyName",
            value: ""
        },
    ]);

    const onStartGame = useCallback(() => {
        if (!isTimeMachineInit && isGameInit) {
            dispatch({ type: 'START_GAME' });
            dispatch({ type: 'TIME_MACHINE_INIT' });
            dispatch({ type: 'START_INFO_MODAL_CLOSE' });
            if (startForm.length > 0) {
                const colonyName = startForm.filter(input => input.name[0] === 'colonyName')[0];
                if (colonyName && colonyName.value.length > 0) dispatch({ 
                    type: 'START_GAME_FORM_UPDATE', 
                    payload: {
                        colonyName: colonyName.value
                    }
                })
            }
        }
    }, [ isTimeMachineInit, isGameInit, startForm, dispatch ]);

    return (
        <Card className="game-modal">
            <p className="hello">Hello, voyager!</p>

            <StartGameForm
                fields={startForm}
                onChange={newFields => setStartForm(newFields)}
            />

            <Button 
                onClick={() => onStartGame()}
                className="game-btn"
            >
                Start
            </Button>
        </Card>
    )
});

export default StartInfo;
