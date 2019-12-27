import React, { useState, useEffect, useCallback } from 'react';

// Sounds
import audio from '../../assets/ogg/thump.ogg';

const SoundPlayer = props => {

    // const audio = () => {
    //     switch(props.audioType) {
    //         case "intro": return intro;
    //         default: return null;
    //     }
    // }

    const audioLoaded = useCallback(event => {
        if(audio.paused && !audio.playing && !audio.progress) {
            audio.play();
        }
    }, []);
    const audioEnd = useCallback(event => {
        console.info("ended: ", audio.ended);
    }, []);

    useEffect(() => {
        audio.addEventListener('loadeddata', audioLoaded);
        return () => {
            audio.removeEventListener('loadeddata', audioLoaded);
        }
      }, []);

    useEffect(() => {
        audio.addEventListener('ended', audioEnd);
        return () => {
            audio.removeEventListener('loadeddata', audioEnd);
        }
    }, []);

    return null;
}

export default SoundPlayer;