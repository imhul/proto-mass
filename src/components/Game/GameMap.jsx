import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TilingSprite } from '@inlet/react-pixi';

// Utils
import utils from '../../utils';

// Graphic
import ground from '../../assets/img/stage_bg.png';

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

class GameMap extends Component {
  
    state = {
        mapPosition: { x: 0, y: 0 }
    };

    componentWillUnmount() {
        cancelAnimationFrame(this.tick);
    }

    tick = () => {

        const centerX = this.props.stage.size.width / 2;
        const centerY = this.props.stage.size.height / 2;
        const distance = Math.floor((
            Math.sqrt(Math.pow(this.props.map.clickPosition.x - centerX, 2) + 
            Math.pow(this.props.map.clickPosition.y - centerY, 2))) * 100) / 100;

        // Check click sectors
        if (Math.abs(this.state.mapPosition.x) < distance || Math.abs(this.state.mapPosition.y) < distance) {
            if (this.props.map.clickPosition.x > centerX && this.props.map.clickPosition.y > centerY) {
                console.log("↘ SE");
                this.setState(state => ({
                    mapPosition: {
                        x: state.mapPosition.x - 1,
                        y: state.mapPosition.y - 1
                    }
                }));
            } else if (this.props.map.clickPosition.x < centerX && this.props.map.clickPosition.y < centerY) {
                console.log("↖ NW ");
                this.setState(state => ({
                    mapPosition: {
                        x: state.mapPosition.x + 1,
                        y: state.mapPosition.y + 1
                    }
                }));
            } else if (this.props.map.clickPosition.x > centerX && this.props.map.clickPosition.y < centerY) {
                console.log("↗ NE ");
                this.setState(state => ({
                    mapPosition: {
                        x: state.mapPosition.x - 1,
                        y: state.mapPosition.y + 1
                    }
                }));
            } else if (this.props.map.clickPosition.x < centerX && this.props.map.clickPosition.y > centerY) {
                console.info("↙ SW");
                this.setState(state => ({
                    mapPosition: {
                        x: state.mapPosition.x + 1,
                        y: state.mapPosition.y - 1
                    }
                }));
            } else {
                cancelAnimationFrame(this.tick);
            }
            requestAnimationFrame(this.tick);
        } else {
            cancelAnimationFrame(this.tick);
        }
    }

    onMap = event => {
        utils.playSFX(MapClick, this.props.game.settings.volume);
        cancelAnimationFrame(this.tick);
        this.props.mapClick(event);
        this.tick();
        // console.log("state.mapPosition.x: ", state.mapPosition.x);
        // console.log("unitPosition.y: ", this.props.map.unitPosition.y);
        // console.log("unitPosition.y: ", this.props.map.unitPosition.y);
        // console.log("props: ", this.props);

        console.log("event.global: ", event.data.global);
    }

    render() {
        const { stage } = this.props;
        return <TilingSprite 
            image={ground}
            width={stage.size.width} 
            height={stage.size.height}
            tilePosition={this.state.mapPosition}
            anchor={0}
            interactive={true}
            pointerdown={event => this.onMap(event)}
        />;
    }
}
  

function mapDispatchToProps(dispatch) {
    return {
        mapClick: event => dispatch({ 
            type: 'MAP_CLICK', 
            payload: { 
                x: event.data.global.x, 
                y: event.data.global.y
            }
        }),
    }
};

function mapStateToProps(state) {
    return {
        game: state.gameReducer,
        stage: state.stageReducer,
        map: state.mapReducer,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);
