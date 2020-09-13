import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';


// Selectors
import { gameSettingsSelector } from '../../selectors/game';

// Components
import { Slider } from 'antd';

// Utils
import { playSFX } from '../../utils';

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const SoundSlider = ({showResult = true}) => {

    const dispatch = useDispatch();
    const gameSettings = useSelector(gameSettingsSelector);

    const setVolume = useCallback(value => {
        playSFX(MapClick, value);
        if (gameSettings.volume !== value) {
            dispatch({ type: 'SET_VOLUME', payload: value });
        }
    }, [dispatch, gameSettings.volume]);

    return (
        <div className="SoundSlider">
            <div className="slider">
                <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    onAfterChange={value => setVolume(value)}
                    defaultValue={gameSettings.volume}
                />
            </div>
            { 
                showResult && <div className="input">
                    <span>{gameSettings.volume}</span>
                    {/* <InputNumber
                        readonly
                        min={0}
                        max={1}
                        step={0.01}
                        value={gameSettings.volume}
                        onChange={value => dispatch({ type: 'SET_VOLUME', payload: value })}
                    /> */}
                </div>
            }
        </div>
    );
}

export default SoundSlider;
