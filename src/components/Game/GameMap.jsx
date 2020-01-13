import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TilingSprite } from '@inlet/react-pixi';

// Actions
import { mapClick } from '../../redux/map/actions';

// Utils
import utils from '../../utils';

// Graphic
import ground from '../../assets/img/stage_bg.png';

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const GameMap = () => { 

    const dispatch = useDispatch();
    const { size } = useSelector(state => state.stage);
    const { mapPosition } = useSelector(state => state.map);
    const { settings } = useSelector(state => state.game);
    const onMap = useCallback(event => {
        utils.playSFX(MapClick, settings.volume);
        dispatch(mapClick(event));
    }, [dispatch]);

    return <TilingSprite 
        image={ground}
        width={size.width} 
        height={size.height}
        tilePosition={mapPosition}
        anchor={0}
        interactive={true}
        pointerdown={event => onMap(event)}
    />;
}

export default GameMap;
