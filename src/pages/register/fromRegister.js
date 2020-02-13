import { Button, Col, Form, Icon, Input, Row } from "antd";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { graphql } from 'react-apollo'
import background from "../../assets/images/bg-lunch.jpg";
import NotiAnimation from "../../components/shared/NotiAnimation";
import gql from 'graphql-tag'
const FormRegister = props => {

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { username, password } = values
                const input = {
                    username,
                    password
                }
                props.registerUser({
                    variables: {
                        input
                    }
                })
                .then(res => {
                    if (res.data.register) {
                        NotiAnimation('success', 'register success', `Đăng ký thành công tài khoản : ${res.data.register.username}`, 'green', 'bottomRight');
                    }
                })
                .catch(err1 => {
                    NotiAnimation('error', 'register fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
                })
            } else {
                NotiAnimation('error', 'register fail', 'Vui lòng điền tài khoản và mật khẩu', 'red', 'bottomRight');
            }
        })
    };

    const { getFieldDecorator } = props.form;

    return (

        <Fragment>
            <Row style={{ background: `url(${background})`, height: "100vh" }}>
                <Col
                    xs={{ span: 24, offset: 0 }}
                    sm={{ span: 16, offset: 8 }}
                    md={{ span: 14, offset: 10 }}
                    lg={{ span: 12, offset: 12 }}
                    xl={{ span: 7, offset: 17 }}
                    style={{ background: "white" }}
                >
                    <Form
                        onSubmit={handleSubmit}
                        className="login-form"
                        style={{
                            float: "right",
                            width: "100%",
                            padding: "56px 40px",
                            textAlign: "center",
                            height: "100vh"
                        }}
                    >
                        <div style={{ textAlign: "center" }} className="logo">
                            <h1>LUNCH APP</h1>
                        </div>
                        <Form.Item>
                            {getFieldDecorator("username", {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your username!'
                                    }
                                ]
                            })
                                (<Input
                                    prefix={
                                        <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                                    }
                                    placeholder="Username"
                                    style={{ width: "320px" }}
                                />)
                            }
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator("password", {
                                rules: [{ required: true, message: "Please input your Password!" }],
                            })
                                (<Input
                                    prefix={
                                        <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                                    }
                                    type="password"
                                    placeholder="Password"
                                    style={{ width: "320px" }}
                                />)
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button
                                style={{ width: "320px" }}
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                            >
                                Register
              </Button>
                            <div className="link-register">
                                Or <Link to="/login">login</Link>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};

const USER_REGISTER = gql`
    mutation($input: UserInput!) {
        register(input: $input) {
            _id
            username
            password
            userPermissions
        }
    }
`

export default graphql(USER_REGISTER, {
    name: 'registerUser',
    options: props => ({
        variables: {
            input: props.input
        }
    })
})(FormRegister);
