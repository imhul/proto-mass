import React from 'react';
import { Progress } from 'antd';

const Preloader = (props) => {
    console.info("Preloader props: ", props);
    return <Progress
        strokeColor={{
            from: '#108ee9',
            to: '#87d068',
        }}
        percent={props.percent}
        status="active"
    />
}

export default Preloader;