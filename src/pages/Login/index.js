import React, { useState, Fragment } from 'react';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
import backgound from '../../images/background/bg-lunch.jpg';
import NotiAnimation  from '../../components/shared/NotiAnimation';
const Login = () => {

    const users = JSON.parse(window.localStorage.getItem('users'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();

        var isAuth = users.some(user => username === user.username && password === user.password);

        if(isAuth) {
            NotiAnimation('success','OK','Đăng nhập thành công','green','bottomRight');
        }
        else {
            NotiAnimation('error','Opps','Sai tài khoản hoặc mật khẩu','red','bottomRight');

        }
    }

    return (
        <Fragment>
            <Row style={{background: `url(${backgound})`, height: '100vh'}} >
                <Col span={16}></Col>
                <Col span={8} style={{background: 'white'}}>
                    <Form onSubmit={handleSubmit} className="login-form" style={{ float: 'right', width: '100%', padding: '56px 40px', textAlign: 'center', height: '100vh'}}>
                        <div style={{textAlign: 'center'}} className="logo"><h1>LUNCH APP</h1></div>
                        <Form.Item>
                            {
                                <Input
                                    onChange={(e) => { setUsername(e.target.value); }}
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                    value={username}
                                    style={{width: '320px'}}
                                />
                            }
                        </Form.Item>
                        <Form.Item>
                            {<Input
                                onChange={(e) => { setPassword(e.target.value); }}
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)'}} />}
                                type="password"
                                placeholder="Password"
                                value={password}
                                style={{width: '320px'}}


                            />}
                        </Form.Item>
                        <Form.Item>
                        
                            <Button style={{width: '320px'}} type="primary" htmlType="submit" className="login-form-button">
                                Log in
          </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </Fragment>


    )
}

export default Login;