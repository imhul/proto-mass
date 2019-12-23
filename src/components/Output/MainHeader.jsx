import React from 'react';
import { Layout } from 'antd';

// Components
import MainMenu from './MainMenu';

const { Header } = Layout;

const MainHeader = () => {
    return (
        <Header>
            <MainMenu />
        </Header>
    );
}

export default MainHeader;