import React from 'react'
import { Form } from 'antd'
import FormRegister from './fromRegister'
const Register = (props) => {
    const WrappedNormalRegisterForm = Form.create({ name: 'normal_register' })(FormRegister);
    return ( <WrappedNormalRegisterForm {...props}/> );
}
 
export default Register;