import React from 'react';
import { useSelector } from 'react-redux';

// Components
import { Progress } from 'antd';

const Preloader = props => {

    const { preloaderTitle } = useSelector(state => state.game);
    
    const format = percent => {
        if (props.format === null) {
            return null
        } else if (props.format === undefined) {
            return `${preloaderTitle.length > 0 ? preloaderTitle : "loading..." } ${percent}%`
        } else return `${percent} ${props.format}`
    };
    
    return <Progress
        className={ `Preloader ${props.class ? props.class : ''}`}
        strokeColor={props.strokeColor || {
            from: '#1D175F',
            to: '#8615B4',
        }}
        strokeWidth={props.strokeWidth || 30}
        strokeLinecap="square"
        percent={props.percent}
        status="active"
        style={props.style || {}}
        format={percent => format(percent)}
    />
};

export default Preloader;
