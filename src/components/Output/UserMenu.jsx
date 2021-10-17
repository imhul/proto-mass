import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCookies, withCookies } from 'react-cookie';
import { Popover, Button } from 'antd';

// Selectors
import { isAuthenticatedSelector, userSelector } from '../../selectors/auth';

// Components
import Avatar from './Avatar';

const UserMenu = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const text = () => <span>Hello, voyager!</span>;
    const [cookie, removeCookie] = useCookies(['userId']);
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const user = useSelector(userSelector);

    const LoginPopup = () => {
        return <Button onClick={() => history.push('/login')}>Login</Button>;
    };

    const LogoutPopup = () => {
        return (
            <Button
                onClick={() => {
                    if (isAuthenticated && cookie.userId) {
                        dispatch({ type: 'SET_AUTH_LOGOUT' });
                        removeCookie('userId');
                        history.push('/');
                    }
                }}
            >
                Logout
            </Button>
        );
    };

    return (
        <div className="UserMenu">
            <Popover
                placement="bottomRight"
                title={text()}
                content={isAuthenticated ? LogoutPopup() : LoginPopup()}
                trigger="click"
            >
                <span>{isAuthenticated ? `${user.login}` : 'login'}</span>
                <Avatar />
            </Popover>
        </div>
    );
};

export default withCookies(UserMenu);
