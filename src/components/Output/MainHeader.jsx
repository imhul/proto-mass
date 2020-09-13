import React from 'react';
import { useSelector } from 'react-redux';

// Selectors
import { getLoadingPercentSelector } from '../../selectors/game';

// Components
import { Layout } from 'antd';
import MainMenu from './MainMenu';

const { Header } = Layout;

const MainHeader = () => {

    const loadingPercent = useSelector(getLoadingPercentSelector);

    return (
        <>
            <Header style={{ backgroundColor: loadingPercent === 0 ? "#4E495F" : "rgba(0,0,0,0)" }}>
                <MainMenu />
            </Header>
            <div className="header-decoration" />
        </>
    );
}

export default MainHeader;