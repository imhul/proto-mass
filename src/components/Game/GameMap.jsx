import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TilingSprite } from '@inlet/react-pixi';
import moment from 'moment';

// Actions
import { 
    mapClick,
    dragMapStart, 
    dragMapMove, 
    dragMapStop 
} from '../../redux/map/actions';

// Utils
import utils from '../../utils';

// Graphic
import ground from '../../assets/img/stage_bg.png';

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const GameMap = () => { 

    const now = moment();
    const msec = moment.unix(now)._i;
    const [clickMoment, setClickMoment] = useState(msec);
    const [dragMoment, setDragMoment] = useState(msec);
    const dispatch = useDispatch();
    // const { size } = useSelector(state => state.stage);
    const { mapPosition, isClicked, isMoved } = useSelector(state => state.map);
    const { settings } = useSelector(state => state.game);

    const onDragStart = useCallback(event => {
        console.info("onDragStart event", event);
        const nowStart = moment();
        const msStart = moment.unix(nowStart)._i;
        setClickMoment(msStart);
        console.info("clickMoment: ", clickMoment);
        console.info("dragMoment: ", dragMoment);
        if ((clickMoment - dragMoment) > 500) {
            console.info("> 500");
            
            dispatch(dragMapStart(event));
        } else {
            utils.playSFX(MapClick, settings.volume);
            dispatch(mapClick(event));
        }
        
        
    }, [dispatch, settings.volume]);

    const onDragEnd = useCallback(event => {
        console.info("onDragEnd event", event);
        dispatch(dragMapStop(event));
    }, [dispatch]);

    const onDragMove = useCallback(event => {
        if (isClicked)  {
            const nowMove = moment();
            const msMove = moment.unix(nowMove)._i;
            setDragMoment(msMove);
            console.info("onDragMove event", event);
            dispatch(dragMapMove(event));
        }
    }, [dispatch, isClicked]);

    return <TilingSprite 
        image={ground}
        width={3000} 
        height={3000}
        tilePosition={mapPosition}
        anchor={0}
        interactive={true}
        pointerdown={event => onDragStart(event)}
        pointerup={event => onDragEnd(event)}
        pointermove={event => onDragMove(event)}
    />;
}

export default GameMap;
