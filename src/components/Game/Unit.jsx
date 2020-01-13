import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withPixiApp, AnimatedSprite } from '@inlet/react-pixi';
import { Texture } from 'pixi.js';

// Graphic
import botPart1 from '../../assets/img/animations/bot/frame_0_delay-0.2s.gif';
import botPart2 from '../../assets/img/animations/bot/frame_1_delay-0.2s.gif';
import botPart3 from '../../assets/img/animations/bot/frame_2_delay-0.2s.gif';
import botPart4 from '../../assets/img/animations/bot/frame_3_delay-0.2s.gif';

class GameUnit extends Component {

    constructor(props) {
        super(props);
        const botImages = [botPart1, botPart2, botPart3, botPart4];
        this.textures = [];
        for (let i=0; i < botImages.length; i++) {
            const texture = new Texture.from(botImages[i]);
            this.textures.push(texture);
        };
    }

    componentDidUpdate(prev) {
        console.info("update! prev: ", prev);
        const { map, units, stage, initPosition } = this.props;

        const centerX = stage.size.width / 2;
        const centerY = stage.size.height / 2;

        if (units.current.status === "absent" &&
            centerX > 0 && centerY > 0 && 
            prev.stage.size.width !== stage.size.width &&
            prev.stage.size.height !== stage.size.height) {
            // &&
            // prev.units.current.position.y !== this.props.units.current.position.y &&
            // prev.units.current.position.x !== this.props.unitscurrent.position.x) {
            initPosition({
                x: centerX,
                y: centerY,
            });
        }

        if (units.current.status !== "absent" &&
            prev.map.clickPosition.x !== map.clickPosition.x &&
            prev.map.clickPosition.y !== map.clickPosition.y) {
            this.tick();   
        }
    }

    // componentWillUnmount() {
    //     cancelAnimationFrame(this.tick);
    // }

    tick = () => {
        console.info("::::tick run::::");

        const { stage, game, map, units, startWalking, stopWalking } = this.props;

        const speed = units.current.stats.speed;

        const centerX = stage.size.width / 2;
        const centerY = stage.size.height / 2;

        const clickPositionX = map.clickPosition.x;
        const clickPositionY = map.clickPosition.y;

        const distance = Math.floor((
            Math.sqrt(Math.pow(clickPositionX - centerX, 2) + 
            Math.pow(clickPositionY - centerY, 2))) * 100) / 100;

        const speedX = speed*Math.cos(Math.atan(
            (centerY - clickPositionY)/(centerX - clickPositionX)));
        const speedY = speed*Math.sin(Math.atan(
            (centerY - clickPositionY)/(centerX - clickPositionX)));

        // Check click sectors
        if (Math.abs(units.current.position.x - centerX) < distance && 
            Math.abs(units.current.position.y - centerY) < distance) {
            if (map.clickPosition.x > centerX && map.clickPosition.y > centerY) {
                console.log("↘ SE");
                startWalking({
                    x: units.current.position.x - speedX,
                    y: units.current.position.y - speedY
                });
            } else if (this.props.map.clickPosition.x < centerX && this.props.map.clickPosition.y < centerY) {
                console.log("↖ NW ");
                startWalking({
                    x: units.current.position.x + speedX,
                    y: units.current.position.y + speedY
                });
            } else if (this.props.map.clickPosition.x > centerX && this.props.map.clickPosition.y < centerY) {
                console.log("↗ NE ");
                startWalking({
                    x: units.current.position.x - speedX,
                    y: units.current.position.y - speedY
                });
            } else if (this.props.map.clickPosition.x < centerX && this.props.map.clickPosition.y > centerY) {
                console.info("↙ SW");
                startWalking({
                    x: units.current.position.x + speedX,
                    y: units.current.position.y + speedY
                });
            } else {
                cancelAnimationFrame(this.tick);
                stopWalking();
            }
            requestAnimationFrame(this.tick);
        } else {
            cancelAnimationFrame(this.tick);
            stopWalking();
        }
    }

    // const onKeyup = event => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     // TODO: need to stop re-rendering!
    //     const amout = 10;
    //     switch (event.code) {
    //         case 'KeyW': 
    //             console.info("up");
    //             dispatch({ 
    //                 type: 'MAP_CLICK', 
    //                 payload: { 
    //                     x: clickPosition.x, 
    //                     y: clickPosition.y - amout,
    //                 } 
    //             });
    //             break;
    //         case 'KeyS':
    //             console.info("down");
    //             dispatch({ 
    //                 type: 'MAP_CLICK', 
    //                 payload: { 
    //                     x: clickPosition.x, 
    //                     y: clickPosition.y + amout,
    //                 } 
    //             });
    //             break;
    //         case 'KeyA':
    //             console.info("left");
    //             dispatch({ 
    //                 type: 'MAP_CLICK', 
    //                 payload: { 
    //                     x: clickPosition.x - amout, 
    //                     y: clickPosition.y,
    //                 } 
    //             });
    //             break;
    //         case 'KeyD':
    //             console.info("right");
    //             dispatch({ 
    //                 type: 'MAP_CLICK', 
    //                 payload: { 
    //                     x: clickPosition.x + amout, 
    //                     y: clickPosition.y,
    //                 } 
    //             });
    //             break;
    //         default:
    //             break;
    //     }
    //     document.removeEventListener('keyup', onKeyup);
    // }

    // document.addEventListener('keyup', onKeyup);

    onSprite = event => {            
        console.log("onSprite click event: ", event);
    }
    
    render() {
        
        const { units } = this.props;
        
        return ( 
            <AnimatedSprite 
                x={units.current.position.x} 
                y={units.current.position.y}
                textures={this.textures}
                isPlaying={true}
                initialFrame={0}
                animationSpeed={0.1}
                interactive={true}
                buttonMode={true}
                pointerdown={event => this.onSprite(event)}
            />
        );
    }
}

const Unit = withPixiApp(GameUnit);

function mapDispatchToProps(dispatch) {
    return {
        initPosition: position => dispatch({ 
            type: 'UNIT_INIT_POSITION', 
            payload: { 
                x: position.x, 
                y: position.y
            }
        }),
        startWalking: position => dispatch({ 
            type: 'UNIT_START_WALKING', 
            payload: { 
                x: position.x, 
                y: position.y
            }
        }),
        stopWalking: () => dispatch({ 
            type: 'UNIT_STOP_WALKING',
        }),
    }
};

function mapStateToProps(state) {
    return {
        game: state.game,
        stage: state.stage,
        map: state.map,
        units: state.unit,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Unit);
