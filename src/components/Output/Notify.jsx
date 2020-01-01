import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { notification, Icon } from 'antd';
import uuidv5 from 'uuid/v5';

const Notify = (notify) => {
    // const dispatch = useDispatch();
    const arr = new Array(16);
    const notifyId = uuidv5(notify.message, arr);
    const color = () => {
        switch(notify.type) {
            case "warn": return "#F804FB";
            case "info": return "#33F6F9";
            case "error": return "#F804FB";
            case "success": return "#52c41a";
            default: return "#33F6F9";
        }
    }

    notification.open({
        message: notify.message ? notify.message : '',
        description: notify.description ? notify.description : '',
        key: notifyId,
        icon: <Icon 
            type={notify.icon} 
            theme="twoTone" 
            twoToneColor={color()} 
        />,
        duration: notify.duration,
        placement: notify.placement,
        className: "Notify",
        onClose: notify.onClose,
            // dispatch({
            //     type: 'ARCHIVE_MESSAGE',
            //     payload: notify,
            // }),
        // },
    });
    return null;
};

export default Notify;