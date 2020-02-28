import React, { useEffect, useState} from 'react'
import { Form } from 'antd'
import FormLogin from './formLogin/index'
const titlePage = 'Đăng nhập'
const Login = (props) => {
    const [title, ] = useState(document.title);
    useEffect(() => {
        document.title = titlePage;
      }, [title]);
    const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(FormLogin);
    return (
            <WrappedNormalLoginForm {...props} />
    );
}

export default Login;