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
    const onMapDown = useCallback(event => {
        utils.playSFX(MapClick, settings.volume);
        dispatch(mapClick(event));
    }, [dispatch]);

    const onDragStart = useCallback(event => {
        console.info("onDragStart event", event);
        // this.data = event.data;
        // this.alpha = 0.5;
        // this.dragging = true;
    }, []);

    const onDragEnd = useCallback(event => {
        console.info("onDragEnd event", event);
        // this.alpha = 1;
        // this.dragging = false;
        // set the interaction data to null
        // this.data = null;
    }, []);

    const onDragMove = useCallback(event => {
        console.info("onDragMove event", event);
        dispatch(mapClick(event)); // TODO;))))))))))))))))))))))))))))
        // if (this.dragging) {
        //     const newPosition = this.data.getLocalPosition(this.parent);
        //     this.x = newPosition.x;
        //     this.y = newPosition.y;
        // }
    }, [dispatch]);

    return <TilingSprite 
        image={ground}
        width={3000} 
        height={3000}
        tilePosition={mapPosition}
        anchor={0}
        interactive={true}
        pointerdown={event => onMapDown(event)}
        pointerdown={event => onDragStart(event)}
        pointerup={event => onDragEnd(event)}
        pointerupoutside={event => onDragEnd(event)}
        pointermove={event => onDragMove(event)}
    />;
}

export default GameMap;
