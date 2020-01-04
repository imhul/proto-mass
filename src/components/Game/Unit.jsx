import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withPixiApp, AnimatedSprite } from '@inlet/react-pixi';
import { Texture } from 'pixi.js';

// Graphic
import botPart1 from '../../assets/img/animations/bot/frame_0_delay-0.2s.gif';
import botPart2 from '../../assets/img/animations/bot/frame_1_delay-0.2s.gif';
import botPart3 from '../../assets/img/animations/bot/frame_2_delay-0.2s.gif';
import botPart4 from '../../assets/img/animations/bot/frame_3_delay-0.2s.gif';

const GameUnit = () => {

    let botImages = [botPart1, botPart2, botPart3, botPart4];
    let textures = [];

    for (let i=0; i < 4; i++)
    {
        let texture = new Texture.from(botImages[i]);
        textures.push(texture);
    };



    const dispatch = useDispatch();
    const { clickPosition } = useSelector(state => state.mapReducer);
    const { size } = useSelector(state => state.stageReducer);
    console.info("Unit position: ", clickPosition);

    const onKeyup = event => {
        event.preventDefault();
        event.stopPropagation();
        // TODO: need to stop re-rendering!
        const amout = 10;
        switch (event.code) {
            case 'KeyW': 
                console.info("up");
                dispatch({ 
                    type: 'MAP_CLICK', 
                    payload: { 
                        x: clickPosition.x, 
                        y: clickPosition.y - amout,
                    } 
                });
                break;
            case 'KeyS':
                console.info("down");
                dispatch({ 
                    type: 'MAP_CLICK', 
                    payload: { 
                        x: clickPosition.x, 
                        y: clickPosition.y + amout,
                    } 
                });
                break;
            case 'KeyA':
                console.info("left");
                dispatch({ 
                    type: 'MAP_CLICK', 
                    payload: { 
                        x: clickPosition.x - amout, 
                        y: clickPosition.y,
                    } 
                });
                break;
            case 'KeyD':
                console.info("right");
                dispatch({ 
                    type: 'MAP_CLICK', 
                    payload: { 
                        x: clickPosition.x + amout, 
                        y: clickPosition.y,
                    } 
                });
                break;
            default:
                break;
        }
        document.removeEventListener('keyup', onKeyup);
    }

    document.addEventListener('keyup', onKeyup);

    const onSprite = event => {            
        console.log("onSprite click event: ", event);
    }
    
    return ( 
        <AnimatedSprite 
            x={size.width * 0.5} 
            y={size.height * 0.5}
            // x={clickPosition.x} 
            // y={clickPosition.y}
            textures={textures}
            isPlaying={true}
            initialFrame={0}
            animationSpeed={0.1}
            interactive={true}
            buttonMode={true}
            pointerdown={event => onSprite(event)}
        />
    );
}

const Unit = withPixiApp(GameUnit);

export default Unit;
