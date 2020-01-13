import React, { useState } from 'react';
import { useSelector, useDispatch }  from 'react-redux';
import AvatarGenerator from 'react-avatar-generator';
import _ from 'lodash';

const Avatar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [isAvatarDone, setAvatarDone] = useState(false);

    const setAvatar = (avatar) => {
        if (_.isEmpty(user) && !isAvatarDone) {
            setAvatarDone(true);
            dispatch({ type: 'SET_AVATAR', payload: avatar })
        }
    }
    
    return <AvatarGenerator 
        ref={avatar => avatar && !isAvatarDone ? setAvatar(avatar.getImageData()) : null}
        colors={['#69179B', '#0F072F']}
        backgroundColor="#F804FB"
        sizing="8"
    />;
  }

  export default Avatar;