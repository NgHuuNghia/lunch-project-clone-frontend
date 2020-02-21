import { Button, Col, Form, Icon, Input, Row, Select } from "antd";
import React, { Fragment, useState, useRef } from "react";
import { useQuery } from '@apollo/react-hooks'
import { Link } from "react-router-dom";
import { graphql } from 'react-apollo'
import Loading from '../../components/shared/loading'
import gql from 'graphql-tag'
import { compose } from 'recompose'
import background from "../../assets/images/bg-lunch.jpg";
import NotiAnimation from "../../components/shared/NotiAnimation";

const { Option } = Select;
const FormRegister = props => {
    const { data, loading, error } = useQuery(GET_ALL_SITES)
    const [sites,setSites] = useState(null)
    const LoadOnceCurrentSites = useRef(false);
    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { username, password, fullname, siteId } = values
                const input = {
                    username,
                    password,
                    fullname,
                    siteId
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
                // NotiAnimation('error', 'register fail', 'Vui lòng điền đầy đủ thông tin', 'red', 'bottomRight');
            }
        })
    };

    const { getFieldDecorator } = props.form;
    if (error) {
        return <div>page not found</div>
     }
     else if (loading) {
        return (<Loading />)
     }
     else {
        if (!LoadOnceCurrentSites.current) {
            setSites(data.sites)
            LoadOnceCurrentSites.current = true;
         }
        return sites === null ? <Loading/> : (
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
                                paddingTop: "10%",
                                textAlign: "center",
                                height: "100vh"
                            }}
                        >
                            <div style={{ textAlign: "center" }} className="logo">
                                <h1>LUNCH APP</h1>
                            </div>
                            <Form.Item>
                                {getFieldDecorator("fullname", {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your fullname!'
                                        }
                                    ]
                                })
                                    (<Input
                                        prefix={
                                            <Icon type="profile" style={{ color: "rgba(0,0,0,.25)" }} />
                                        }
                                        placeholder="Fullname"
                                        style={{ width: "320px" }}
                                    />)
                                }
                            </Form.Item>
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
                                    (<Input.Password
                                        prefix={
                                            <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                                        }
                                        placeholder="Password"
                                        style={{ width: "320px" }}
                                    />)
                                }
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator("siteId", {
                                    initialValue: `${sites[0].name}`,
                                    rules: [
                                        {
                                            required: true,
                                        }
                                    ]
                                })
                                    (<Select
                                        style={{ width: "320px" }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                          sites &&  sites.map((site,i) => <Option key={site._id} value={site._id}>{site.name}</Option>)
                                        }
                                        
                                    </Select>)
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
        )
    }
}


const USER_REGISTER = gql`
    mutation($input: CreateUserInput!) {
        register(input: $input) {
            _id
            username
            password
            fullname
            siteId
            role
        }
    }
`
const GET_ALL_SITES = gql`
    query {
        sites {
            _id
            name
        }
    }
`
export default compose(
    graphql(USER_REGISTER, {
        name: 'registerUser',
        options: props => ({
            variables: {
                input: props.input
            }
        })
    })
)(FormRegister);
