import React, { useState, useRef, } from 'react';
import { useSelector } from 'react-redux';
import { useDrop, useDrag } from 'react-dnd';
import update from 'immutability-helper';

// Components
import GameMap from './GameMap';

const boxStyle = {
    position: 'absolute',
    padding: 0,
    cursor: 'move',
  }

const ItemTypes = {
    BOX: 'box',
    MAP: 'map',
};

export const GameMapDrag = ({ left, top }) => {
    
    const [, drag] = useDrag({
        item: { 
            id: 'map-drag', 
            left, 
            top, 
            type: ItemTypes.MAP 
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag} style={{ ...boxStyle, left, top }}>
           <GameMap />
        </div>
    )
};

const DnD = () => {

    const { size } = useSelector(state => state.stage);
    const [box, setBox] = useState({ top: -300, left: 0 });
    const containerStyle = {
        width: size.width,
        height: size.height,
        border: '1px solid black',
        position: 'relative',
    };

    const [, drop] = useDrop({
            accept: ItemTypes.MAP,
            drop(item, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset();
                const left = Math.round(item.left + delta.x);
                const top = Math.round(item.top + delta.y);
                moveBox(left, top);
                return undefined
            },
    });

    const moveBox = (left, top) => {
        setBox(
            update(box, {
                    $merge: { left, top },
                },
            ),
        )
    };

    return (
        <div ref={drop} style={containerStyle}>
            { console.info('box.left: ', box.left) }
            { console.info('box.top: ', box.top) }
            <GameMapDrag left={box.left} top={box.top} />
        </div>
    )
};

export default DnD;
