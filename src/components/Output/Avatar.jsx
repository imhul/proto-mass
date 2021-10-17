import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Selectors
import { isAuthenticatedSelector, userSelector } from '../../selectors/auth';

// Components
import AvatarGenerator from 'react-avatar-generator';

const Avatar = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const user = useSelector(userSelector);

    const setAvatar = useCallback(
        avatar => {
            dispatch({ type: 'SET_AVATAR', payload: avatar });
        },
        [dispatch]
    );

    return (
        <>
            {isAuthenticated ? (
                <>
                    {user.avatar ? (
                        <img src={user.avatar} width="30" height="30" alt="user avatar" />
                    ) : (
                        <AvatarGenerator
                            ref={avatar => (avatar ? setAvatar(avatar.getImageData()) : null)}
                            colors={['#69179B', '#0F072F']}
                            backgroundColor="#F804FB"
                            sizing="10"
                        />
                    )}
                </>
            ) : null}
        </>
    );
};

export default Avatar;
