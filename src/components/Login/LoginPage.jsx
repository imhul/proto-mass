import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { Card, Form, Icon, Input, Button, Checkbox } from 'antd';
import uuidv5 from 'uuid/v5';
import { useCookies, withCookies } from 'react-cookie';
import users from './users';

const FormItem = Form.Item;

const LoginForm = (props) => {

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { getFieldDecorator } = props.form;
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [cookies, setCookie, removeCookie] = useCookies(['userId']);
  const { cookiesFromProps } = props.cookies;
  const isHasCookies = props.cookies.HAS_DOCUMENT_COOKIE;
  const setUserIdCookie = (id) => {
    setCookie('userId', id, { path: '/' });
  }

  const onSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      
      if (!err) {

        // mock
        users.map(user => {
          // if (!isAuthenticated && isHasCookies && cookies.userId && cookies.userId === unit.id) {
          if (!isAuthenticated) { // mock

            setUserIdCookie(user.id);
      
            dispatch({ 
              type: 'SET_AUTH_LOGIN', 
              payload: { 
              login: user.username, 
                pass: user.password, 
                remember: user.remember,
                id: user.id,
                avatar: user.avatar,
              } 
            });
            history.replace('./game');
            return null
          }
        });
        // mock end
        
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
      } else {
        console.warn('Received values error: ', err);
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

const LoginPage = Form.create({ name: 'login' })(LoginForm);

export default withCookies(LoginPage);
