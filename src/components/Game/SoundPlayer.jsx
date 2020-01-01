import React, { createRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sound from 'react-sound';
import { soundManager } from 'soundmanager2';

const SoundPlayer = props => {

    const { settings } = useSelector(state => state.gameReducer);
    const url = props.src ? props.src : props;

    const onSongLoaded = event => {
        console.info("onSongLoaded", event.loaded);
    }

    const onFinishedPlaying = () => {
        console.info("onFinishedPlaying");
    }

    useEffect(() => { 
        console.info("SoundPlayer useEffect...");
        return () => {
            soundManager.stop(url);
        }
    }, []);

    return (
        <Sound
            url={url}
            playStatus={Sound.status.PLAYING}
            onLoad={onSongLoaded}
            onFinishedPlaying={onFinishedPlaying}
            volume={settings.volume}
        />
    );
}

export default SoundPlayer;