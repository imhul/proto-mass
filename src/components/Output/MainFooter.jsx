import React from 'react';
import { Layout } from 'antd';
import techLogo from '../../assets/img/react-logo.png';

const { Footer } = Layout;

const MainFooter = () => {
    return (
        <Footer>
            <span>
                Developed by{' '}
                <a
                    href="http://weblogic.com.ua/"
                    target="_blank"
                    title="Tkachuk Zakhar portfolio"
                    rel="noopener noreferrer"
                >
                    Tkachuk Zakhar
                </a>
            </span>
            <span>
                <img width="40" src={techLogo} alt="react logo" />
            </span>
        </Footer>
    );
};

export default MainFooter;
