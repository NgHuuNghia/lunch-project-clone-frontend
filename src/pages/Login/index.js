import React, { useState, Fragment } from 'react';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
import backgound from '../../images/background/bg-lunch.jpg';
import NotiAnimation from '../../components/shared/NotiAnimation';
import { Link } from 'react-router-dom';
const Login = (props) => {
    const users = JSON.parse(window.localStorage.getItem('users'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        var isUser = users && users.some(user => username === user.username && password === user.password);

        if (isUser) {
            window.localStorage.setItem('account', JSON.stringify({ username: username, password: password }));
            props.setToken(window.localStorage.getItem('account'));
            props.setIsAuth(true);
            // NotiAnimation('success','OK','Đăng nhập thành công','green','bottomRight');
        }
        else {
            NotiAnimation('error', 'Opps', 'Sai tài khoản hoặc mật khẩu', 'red', 'bottomRight');

        }


    }

    return (
        <Fragment>
            <Row style={{ background: `url(${backgound})`, height: '100vh' }} >
                <Col xs={{ span: 24, offset: 0 }}
                    sm={{ span: 16, offset: 8 }}
                    md={{ span: 14, offset: 10 }}
                    lg={{ span: 12, offset: 12 }}
                    xl={{ span: 7, offset: 17 }}
                    style={{ background: 'white' }}
                >
                    <Form onSubmit={handleSubmit} className="login-form" style={{ float: 'right', width: '100%', padding: '56px 40px', textAlign: 'center', height: '100vh' }}>
                        <div style={{ textAlign: 'center' }} className="logo"><h1>LUNCH APP</h1></div>
                        <Form.Item>
                            {
                                <Input
                                    onChange={(e) => { setUsername(e.target.value); }}
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                    value={username}
                                    style={{ width: '320px' }}
                                />
                            }
                        </Form.Item>
                        <Form.Item>
                            {<Input
                                onChange={(e) => { setPassword(e.target.value); }}
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                                value={password}
                                style={{ width: '320px' }}


                            />}
                        </Form.Item>
                        <Form.Item>

                            <Button style={{ width: '320px' }} type="primary" htmlType="submit" className="login-form-button">
                                Log in
          </Button>
                            <div className="link-register">
                                Or <Link to="/register">register</Link>``
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </Fragment>


    )
}

export default Login;