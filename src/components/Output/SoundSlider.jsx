import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies, withCookies } from 'react-cookie';
import { Slider } from 'antd';

const SoundSlider = () => {

    const dispatch = useDispatch();
    const { settings } = useSelector(state => state.game);
    const [cookies, setCookie, removeCookie] = useCookies(['volume']);

    const setVolume = value => {
        setCookie('volume', value, { path: '/' });
        dispatch({ type: 'SET_VOLUME', payload: value });
    }

    useEffect(() => {
        if (cookies.volume) {
            dispatch({ type: 'SET_VOLUME', payload: +cookies.volume });
        }
    }, [dispatch, cookies.volume]);

    return (
        <div className="SoundSlider">
            <div className="slider">
                <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={value => setVolume(value)}
                    value={settings.volume}
                />
            </div>
            <div className="input">
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
        </div>
    );
}

export default withCookies(SoundSlider);
