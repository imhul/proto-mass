import React from 'react';
import { Progress } from 'antd';

const Preloader = props => {
    const format = percent => {
        if (props.format === null) {
            return null
        } else if (props.format === undefined) {
            return `${percent}%`
        } else return `${percent} ${props.format}`
    };
    return (
        <Progress
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
    )
};


export default Preloader;