import React from 'react';
import { Layout } from 'antd';
import techLogo from '../../assets/img/react-pixijs-logo.png';

const { Footer } = Layout;

const MainFooter = () => {
    return (
        <Footer>
            <span>Developed by <a href="http://weblogic.com.ua/" title="Tkachuk Zakhar portfolio">Tkachuk Zakhar ©</a></span>
            <span><img width="100" src={techLogo} alt="react & pixijs logo" /></span>
        </Footer>
    );
}

export default MainFooter;