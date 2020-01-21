import React, { useState, Fragment } from 'react';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
import backgound from '../../images/background/bg-lunch.jpg';
import NotiAnimation  from '../../components/shared/NotiAnimation';
import { Link } from 'react-router-dom';
const Register = (props) => {
    const users = JSON.parse(window.localStorage.getItem('users')) ? JSON.parse(window.localStorage.getItem('users')) : [];
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        var isAuth = Array.isArray(users) && users.length ?  users.some(user => username === user.username) : false;

        if(isAuth) {
            NotiAnimation('error','Opps','Tài khoản này đã được sử dụng','red','bottomRight');
        }
        else {
            var user = { username: username, password: password};
            users.push(user);
            window.localStorage.setItem('users',JSON.stringify(users));
            NotiAnimation('success',`Tài khoản : ${username}`,'Đăng Ký thành công','green','bottomRight');
        }

        
    }

    return (
        <Fragment>
            <Row style={{background: `url(${backgound})`, height: '100vh'}} >
                <Col span={17}></Col>
                <Col span={7} style={{background: 'white'}}>
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
                                Register
          </Button>
          Or <Link to="/login">login</Link>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </Fragment>


    )
}

export default Register;