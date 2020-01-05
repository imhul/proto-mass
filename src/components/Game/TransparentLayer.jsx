import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TilingSprite } from '@inlet/react-pixi';

// Graphic
import layer from '../../assets/img/clouds.png';
import cursor from '../../assets/img/cur.gif';

class TransparentLayer extends Component {
  
    state = {
        mapPosition: { x: 0, y: 0 }
    };

    componentDidMount() {
        this.tick();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.tick);
    }

    tick = () => {
        requestAnimationFrame(this.tick);
        this.setState(state => ({
            mapPosition: {
                x: state.mapPosition.x - 0.5,
                y: state.mapPosition.y + 0.5,
            }
        }));
    }

    render() {
        const { stage } = this.props;
        return <TilingSprite 
            image={layer}
            width={stage.size.width} 
            height={stage.size.height}
            tilePosition={this.state.mapPosition}
            anchor={0}
            cursor={cursor} 
            className="TransparentLayer"
            interactive={false}
            buttonMode={false}
        />;
    }
}

function mapStateToProps(state) {
    return {
        stage: state.stageReducer,
    }
};

export default connect(mapStateToProps)(TransparentLayer);
