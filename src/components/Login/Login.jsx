import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { firestore } from '../../redux/store';
import { useCookies, withCookies } from 'react-cookie';

// Components
import { Card, Form, Input, Button, Checkbox } from 'antd';
import {
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';
import Notify from '../Output/Notify';

// utils
import uuidv5 from 'uuid/v5';

const FormItem = Form.Item;

const NormalLoginForm = props => {

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { profile, auth } = useSelector(state => state.firebase);
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    const { cookiesFromProps } = props.cookies;
    const isHasCookies = props.cookies.HAS_DOCUMENT_COOKIE;
    const setUserIdCookie = id => {
        setCookie('userId', id, { path: '/' });
    }


    // mocked login
    useEffect(() => {
        const collection = firestore.collection('users')
            .doc('N0iQ4vJiMKXOsPKoMOyK')
            .get()
            .then(doc => {
                const data = doc.data();
                if (data) {
                    if (!isAuthenticated && profile.isLoaded && auth.isLoaded) {
                        dispatch({ type: 'SET_AUTH_LOGIN', payload: data });
                    }
                }
            }).catch(error => {
                dispatch({
                    type: 'SET_AUTH_ERROR', payload: {
                        code: `Error: ${error.code ? error.code : 'unknown!'}`,
                        message: `Description: ${error.message ? error.message : error}`,
                    }
                });
                Notify({
                    type: "warn",
                    message: `Error: ${error.code ? error.code : 'unknown!'}`,
                    description: `Description: ${error.message ? error.message : error}`,
                    icon: "warning",
                    duration: 3
                })
            });
    }, [profile, auth, dispatch, isAuthenticated]);

    const onFinish = useCallback(values => {
        if (isAuthenticated) history.replace('./game');
        console.log('Received values of form: ', values);
    }, [isAuthenticated, history]); // dispatch

    return (
        <Card className="game-modal">
            <p className="hello">Hello, voyager!</p>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <FormItem
                    name="username"
                    rules={[
                        {
                            required: false, // true
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </FormItem>
                <FormItem
                    name="password"
                    rules={[
                        {
                            required: false, // true
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </FormItem>
                <FormItem className="flex-item">
                    <FormItem name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </FormItem>

                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Login
                    </Button>
                </FormItem>

                <FormItem>
                    <a className="login-form-forgot" href="/reset">
                        Forgot password?
                    </a>
                </FormItem>
                
                <FormItem>
                    <a href="/register">Registration</a>
                </FormItem>
            </Form>
        </Card>
    );
};

export default withCookies(NormalLoginForm);
