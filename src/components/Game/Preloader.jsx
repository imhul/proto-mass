import React from 'react';
import { Progress } from 'antd';

const Preloader = (props) => {
    if (props.percent < 100) {
        return <Progress
            strokeColor={{
                from: '#108ee9',
                to: '#87d068',
            }}
            percent={props.percent}
            status={props.percent < 100 ? 'active' : 'success' }
        />
    } else return null;
}

export default Preloader;