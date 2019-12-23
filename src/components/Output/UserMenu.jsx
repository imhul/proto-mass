import React from 'react';
import { useSelector } from 'react-redux';
import Avatar from './Avatar';

const UserMenu = () => {

    const { isAuthenticated, user } = useSelector(state => state.authReducer);

    return (
        <div className="UserMenu">
            <span>{ isAuthenticated ? `${ user.login }` : "Hello!" }</span>
            <Avatar />
        </div>
    );
}

export default UserMenu;