import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { Card, Form, Icon, Input, Button, Checkbox } from 'antd';
import uuidv5 from 'uuid/v5';
import { useCookies, withCookies } from 'react-cookie';
import users from './users';


const LoginForm = (props) => {

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { getFieldDecorator } = props.form;
  const { isAuthenticated, user } = useSelector(state => state.authReducer);
  const [newCookies, setCookie] = useCookies(['name']);
  const { cookies } = props.cookies;
  const isHasCookies = props.cookies.HAS_DOCUMENT_COOKIE;

  users.map(unit => {
    // if (!isAuthenticated && isHasCookies && cookies.userId && cookies.userId === unit.id) {
    if (!isAuthenticated) { // mock

      dispatch({ 
        type: 'SET_AUTH_LOGIN', 
        payload: { 
        login: unit.username, 
          pass: unit.password, 
          remember: unit.remember,
          id: unit.id,
          avatar: unit.avatar,
        } 
      });
      history.replace('./game');
      // setTimeout(() => {
      //   history.replace('./game');
      // }, 1000);
      return null
    }
  });

  const setUserIdCookie = (id) => {
    setCookie('userId', id, { path: '/' });
  }

  const onSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      
      if (!err) {
        
        if (values.username.length >= 4 && values.password.length >= 8) {
          let newId;
          if (!user.id && isHasCookies && !cookies.userId) {
            const arr = new Array(16);
            newId = uuidv5(values.username, arr); 
            setUserIdCookie(newId);         
          } else if (isHasCookies && cookies.userId) {
            newId = cookies.userId;
          }

          dispatch({ 
            type: 'SET_AUTH_LOGIN', 
            payload: { 
            login: values.username, 
              pass: values.password, 
              remember: values.remember,
              id: newId,
              avatar: user.avatar,
            } 
          });

          // if (isAuthenticated) setTimeout(() =>
          //   history.replace('./game'),
          // 2000);

          if (isAuthenticated) history.replace('./game');
        }
      } else {
        console.warn('Received values error: ', err);
      }
    });
  };
  
  return (
    <Card className="Login">
      <p>Hello!</p>
      <Form onSubmit={(form) => onSubmit(form)} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
           {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                })(<Checkbox>Remember me</Checkbox>)}
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                
                
          <div>
            <a className="login-form-forgot" href="/reset">
                Forgot password?
            </a>
            <br />
            <a href="/register">Register now!</a>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}

const LoginPage = Form.create({ name: 'login' })(LoginForm);

export default withCookies(LoginPage);
