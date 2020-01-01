import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies, withCookies } from 'react-cookie';
import { Slider, Typography, InputNumber } from 'antd';

const SoundSlider = () => {

    const dispatch = useDispatch();
    const { settings } = useSelector(state => state.gameReducer);
    const { Title } = Typography;
    const [cookies, setCookie, removeCookie] = useCookies(['volume']);
    console.info("SoundSlider cookies: ", cookies);
    const setVolume = value => {
        console.info("setVolume value: ", value);
        setCookie('volume', value, { path: '/' });
        dispatch({ type: 'SET_VOLUME', payload: value });
    }

    useEffect(() => {
        if (cookies.volume) {
            dispatch({ type: 'SET_VOLUME', payload: +cookies.volume });
        }
    }, []);

    return (
        <div className="SoundSlider">
            <div className="slider">
                <Slider
                    min={1}
                    max={100}
                    onChange={value => setVolume(value)}
                    value={settings.volume}
                />
            </div>
            <div className="input">
                <InputNumber
                    min={1}
                    max={100}
                    value={settings.volume}
                    onChange={value => dispatch({ type: 'SET_VOLUME', payload: value })}
                />
            </div>
        </div>
    );
}

export default withCookies(SoundSlider);
