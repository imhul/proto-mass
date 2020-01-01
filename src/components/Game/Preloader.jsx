import React from 'react';
import { Progress } from 'antd';

const Preloader = props => (
    <Progress
        className="Preloader"
        strokeColor={{
            from: '#1D175F',
            to: '#8615B4',
        }}
        strokeWidth={30}
        strokeLinecap="square"
        percent={props.percent}
        status="active"
    />
);


export default Preloader;