import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { firestore } from '../../redux/api';

// Selectors
import { isAuthenticatedSelector } from '../../selectors/auth';
import { 
    profileFirebaseSelector,
    authFirebaseSelector,
} from '../../selectors/firebase';

// Components
import { Card, Form, Input, Button, Checkbox } from 'antd';
import {
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';
import Notify from '../Output/Notify';

const FormItem = Form.Item;

const Login = props => {

    const history = useHistory();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const profileFirebase = useSelector(profileFirebaseSelector);
    const authFirebase = useSelector(authFirebaseSelector);

    // mocked login
    useEffect(() => {
        firestore.collection('users')
            .doc('N0iQ4vJiMKXOsPKoMOyK')
            .get()
            .then(response => {
                const data = response.data();
                if (data) {
                    if (!isAuthenticated && profileFirebase.isLoaded && authFirebase.isLoaded) {
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
    }, [profileFirebase, authFirebase, dispatch, isAuthenticated]);

    // mocked effect
    useEffect(() => {
        isAuthenticated && history.replace('./game');
    }, [isAuthenticated, history]);
    // mocked effect end

    const onFinish = useCallback(values => {
        // TODO: validation!
        if (isAuthenticated) history.replace('./game');
        console.log('Received values of form: ', values);
    }, [isAuthenticated, history]); // dispatch (mocked)

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
                            required: false, // true (mocked)
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
                            required: false, // true (mocked)
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

                    <Button type="primary" htmlType="submit" loading={!isAuthenticated} className="game-btn">
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

export default Login;
