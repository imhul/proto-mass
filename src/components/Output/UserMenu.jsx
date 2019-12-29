import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import Avatar from './Avatar';
import { Popover, Button } from 'antd';

const UserMenu = () => {

    const { isAuthenticated, user } = useSelector(state => state.authReducer);

    const LoginPopup = () => {
        const history = useHistory();
        return <Button onClick={() => history.push('/login')}>Login</Button>;
    }
    
    const text = () => <span>Hello, voyager!</span>;

    return (
        <div className="UserMenu">
            <Popover placement="bottomRight" title={text()} content={LoginPopup()} trigger="click">
                <span>
                    { isAuthenticated ? `${ user.login }` : "Wellcome!" }
                </span>
                <Avatar />
            </Popover>
        </div>
    );
}

export default UserMenu;