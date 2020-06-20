import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Slider } from 'antd';

// Utils
import { playSFX } from '../../utils';

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const SoundSlider = ({showResult = true}) => {

    const dispatch = useDispatch();
    const { settings } = useSelector(state => state.game);

    const setVolume = useCallback(value => {
        playSFX(MapClick, value);
        if (settings.volume !== value) {
            dispatch({ type: 'SET_VOLUME', payload: value });
        }
    }, [dispatch, settings.volume]);

    return (
        <div className="SoundSlider">
            <div className="slider">
                <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    onAfterChange={value => setVolume(value)}
                    defaultValue={settings.volume}
                />
            </div>
            { 
                showResult && <div className="input">
                    <span>{settings.volume}</span>
                    {/* <InputNumber
                        readonly
                        min={0}
                        max={1}
                        step={0.01}
                        value={settings.volume}
                        onChange={value => dispatch({ type: 'SET_VOLUME', payload: value })}
                    /> */}
                </div>
            }
        </div>
    );
}

export default SoundSlider;
