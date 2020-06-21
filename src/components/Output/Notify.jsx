import React from 'react';

// Components
import { notification } from 'antd';
import {
    WarningTwoTone,
    InfoCircleTwoTone,
    SaveTwoTone,
    CheckCircleTwoTone,
  } from '@ant-design/icons';

// utils
import uuidv5 from 'uuid/v5';

const Notify = notify => {
    // const dispatch = useDispatch();
    const arr = new Array(16);
    const notifyId = uuidv5(notify.message, arr);
    const color = () => {
        switch(notify.type) {
            case "warn": return "#816271";
            case "info": return "#20394F";
            case "error": return "#811350";
            case "success": return "#838A54";
            default: return "#20394F";
        }
    }
    const icon = () => {
        switch(notify.icon) {
            case "warning": return <WarningTwoTone
                theme="twoTone" 
                twoToneColor={color()}
            />;
            case "info": return <InfoCircleTwoTone
                theme="twoTone" 
                twoToneColor={color()}
            />;
            case "save": return <SaveTwoTone
                theme="twoTone" 
                twoToneColor={color()}
            />;
            case "success": return <CheckCircleTwoTone
                theme="twoTone" 
                twoToneColor={color()}
            />;
            default: return <InfoCircleTwoTone
                theme="twoTone" 
                twoToneColor={color()}
            />;
        }
    }

    notification.open({
        message: notify.message ? notify.message : '',
        description: notify.description ? notify.description : '',
        key: notifyId,
        icon: icon(),
        duration: notify.duration,
        placement: notify.placement,
        className: "Notify",
        onClose: notify.onClose,
        top: 80,
            // dispatch({
            //     type: 'ARCHIVE_MESSAGE',
            //     payload: notify,
            // }),
        // },
    });
    return null;
};

export default Notify;