import React from 'react'
import { Form } from 'antd'
import FormLogin from './formLogin'
const Login = (props) => {
    const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(FormLogin);
    return ( <WrappedNormalLoginForm {...props}/> );
}
 
export default Login;