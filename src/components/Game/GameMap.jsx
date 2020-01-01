import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TilingSprite, } from '@inlet/react-pixi';

// Components
import SoundPlayer from './SoundPlayer';

// Graphic
import bg from '../../assets/img/stage_bg.png';
// import cursor from '../../assets/img/cur306.ani';

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const GameMap = () => {

    const dispatch = useDispatch();
    const { size } = useSelector(state => state.stageReducer);

    const onMap = event => {
        dispatch({ 
            type: 'MAP_CLICK', 
            payload: { 
                x: event.data.global.x, 
                y: event.data.global.y
            } 
        })
    }

    return <>
        <SoundPlayer src={MapClick} />
        <TilingSprite 
            image={bg}
            width={size.width} 
            height={size.height}
            x={0}
            y={0}
            anchor={0}
            interactive={true}
            buttonMode={true}
            pointerdown={event => onMap(event)}
        />
    </>;
}

export default GameMap;