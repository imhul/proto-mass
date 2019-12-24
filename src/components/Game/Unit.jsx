import React, { useState } from 'react';
import { 
    Application,
    withPixiApp, 
    PixiComponent, 
    ParticleContainer, 
    Stage, 
    Container, 
    Sprite, 
    Texture, 
    particles,
    Rectangle,
    render,
} from '@inlet/react-pixi';

const GameUnit = () => {

    const [rotation, rotate] = useState(0);
    const [XPath, setXPath] = useState(400);
    const [YPath, setYPath] = useState(300);

    document.addEventListener('keyup', event => {
        console.info("event", event.code);
        const amout = 10;
        switch (event.code) {
            case 'KeyW': 
                console.info("up");
                setYPath(YPath - amout); break;
            case 'KeyS':
                console.info("down");
                setYPath(YPath + amout); break;
            case 'KeyA':
                console.info("left");
                setYPath(XPath + amout); break;
            case 'KeyD':
                console.info("right");
                setYPath(XPath - amout); break;
            default:
                break;
        }
    });

    const RotatingBunny = () => {
        const onSprite = event => {            
            if (event.data.pointerType === 'mouse') {
                rotate(rotation + (Math.cos(38/1000) || 0) * 0.1);
                // requestAnimationFrame()
            } 
        }
        return (
            <Sprite 
                image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
                x={XPath}
                y={YPath}
                scale={[2 + Math.abs(2 * rotation), 2 + Math.abs(2 * rotation)]}
                rotation={rotation}
                anchor={[0.5, 0.5]}
                interactive={true}
                buttonMode={true}
                pointerdown={event => onSprite(event)}
            />
        )
    };

    return ( <RotatingBunny /> ) 
};

const Unit = withPixiApp(GameUnit)

export default Unit;