import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { firestore } from '../../redux/store';
import { Card, Form, Icon, Input, Button, Checkbox } from 'antd';
import { useCookies, withCookies } from 'react-cookie';
import Notify from '../Output/Notify';
import uuidv5 from 'uuid/v5';
import _ from 'lodash';

const FormItem = Form.Item;

const LoginForm = props => {

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const { getFieldDecorator } = props.form;
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { save } = useSelector(state => state.game);
    const { unitList } = useSelector(state => state.unit);
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    const { cookiesFromProps } = props.cookies;
    const isHasCookies = props.cookies.HAS_DOCUMENT_COOKIE;
    const setUserIdCookie = (id) => {
        setCookie('userId', id, { path: '/' });
    }


    // mocked login
    useEffect(() => {
        const collection = firestore.collection('users').doc('N0iQ4vJiMKXOsPKoMOyK').get()
            .then(doc => {
                const data = doc.data();
                // console.info('doc.id: ', doc.id);
                if (data) {
                    dispatch({ type: 'SET_AUTH_LOGIN', payload: data });
                    if (_.isEmpty(save)) {
                        dispatch({ 
                            type: 'LOAD_GAME_SAVE', 
                            payload: data.save 
                        });
                    }
                    if (_.isEmpty(unitList)) {
                        dispatch({ 
                            type: 'UNITS_LOADED', 
                            payload: data.save.units
                        });
                    }
                }
            }).catch(error => {
                dispatch({ type: 'SET_AUTH_ERROR', payload: error });
                Notify({
                    type: "warn",
                    message: `Error: ${error.code ? error.code : 'unknown!'}`,
                    description: `Description: ${error.message ? error.message : error}`,
                    icon: "warning",
                    duration: 3
                })
            });
    }, [ dispatch, save, unitList ]);

    const onSubmit = e => {
        e.preventDefault();
        props.form.validateFields((error, values) => {

            if (!error) {

                // if (values.username.length >= 4 && values.password.length >= 8) {
                //   let newId;
                //   if (!user.id && isHasCookies && !cookiesFromProps.userId) {
                //     const arr = new Array(16);
                //     newId = uuidv5(values.username, arr); 
                //     setUserIdCookie(newId);         
                //   } else if (isHasCookies && cookiesFromProps.userId) {
                //     newId = cookiesFromProps.userId;
                //   }

                //   dispatch({ 
                //     type: 'SET_AUTH_LOGIN', 
                //     payload: { 
                //     login: values.username, 
                //       pass: values.password, 
                //       remember: values.remember,
                //       id: newId,
                //       avatar: user.avatar,
                //     } 
                //   });

                //   if (isAuthenticated) setTimeout(() =>
                //     history.replace('./game'),
                //   2000);
                // }
                console.warn('Received values: ', values);
            } else {
                console.warn('Received values error: ', error);
            }
        });
    };

    return (
        <Card className="Login">
            <p className="hello">Hello, voyager!</p>
            <Form onSubmit={(form) => onSubmit(form)} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: false, message: 'Please input your username!' }], // required: true
                    })(
                        <Input autoComplete="off"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />,
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: false, message: 'Please input your Password!' }], // required: true
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </FormItem>
                <FormItem className="flex-item">
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>Remember me</Checkbox>)}
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Login
          </Button>
                </FormItem>
                <FormItem>
                    <a className="login-form-forgot" href="/reset">
                        Forgot password?
            </a>
                    <br />
                    <a href="/register">Register now!</a>
                </FormItem>
            </Form>
        </Card>
    );
}

const Login = Form.create({ name: 'login' })(LoginForm);

export default withCookies(Login);
