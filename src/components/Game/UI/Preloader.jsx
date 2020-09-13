import React, { memo } from 'react';
import { useSelector } from 'react-redux';

// Selectors
import { preloaderTitleSelector } from '../../../selectors/game';

// Components
import { Progress } from 'antd';

const Preloader = memo(props => {

    const preloaderTitle = useSelector(preloaderTitleSelector);
    
    const format = percent => {
        if (props.format === null) {
            return null
        } else if (props.format === undefined) {
            return `${preloaderTitle && preloaderTitle.length > 0 ? preloaderTitle : "loading..." } ${percent}%`
        } else return `${percent} ${props.format}`
    };
    
    return <Progress
        className={ `Preloader ${props.class ? props.class : ''}`}
        strokeColor={props.strokeColor || {
            from: '#997577',
            to: '#0F2A3F',
        }}
        strokeWidth={props.strokeWidth || 30}
        strokeLinecap="square"
        percent={props.percent}
        status="active"
        style={props.style || {}}
        format={percent => format(percent)}
    />
});

export default Preloader;
