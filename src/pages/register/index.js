import React, { useState, useEffect} from 'react'
import { Form } from 'antd'
import FormRegister from './fromRegister/index'
const titlePage = 'Đăng Ký'
const Register = (props) => {
    const [title, ] = useState(document.title);
    useEffect(() => {
        document.title = titlePage;
      }, [title]);
    const WrappedNormalRegisterForm = Form.create({ name: 'normal_register' })(FormRegister);
    return (
            <WrappedNormalRegisterForm {...props} />
    );
}

export default Register;