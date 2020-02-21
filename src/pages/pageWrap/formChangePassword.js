import { Form, Input } from "antd";
import React from "react";
import { graphql } from 'react-apollo'
import NotiAnimation from "../../components/shared/NotiAnimation";
import gql from 'graphql-tag'
import { useStore } from 'react-redux'

const FormChangePassword = props => {

    const store = useStore()

    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== props.form.getFieldValue('newpassword')) {
            callback('Xác nhận mật khẩu không khớp!');
        } else {
            callback();
        }
    }

    const validateToNextPassword = (rule, value, callback) => {
        
        if(value ===  props.form.getFieldValue('currentpassword')){
            callback('Mật khẩu trùng với mật khẩu hiện tại.');
        }
        else if (value.length <3 || value.length >20) {
            callback('Mật khẩu chỉ chứa từ 3 đến 20 ký tự.');
        }
        else if (value) {
            props.form.validateFields(['confirmpassword'], { force: true });
        }
        callback();
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { currentpassword, newpassword } = values
                props.changePasswordUser({
                    variables: {
                        _id: store.getState().currentUser._id,
                        currentpassword: currentpassword,
                        password: newpassword
                    }
                })
                    .then(res => {
                        if (res.data.changePassword) {
                            NotiAnimation('success', 'change password success', `Đổi mật khẩu thành công!`, 'green', 'bottomRight');
                            props.SetisOpenModal(false)
                        }
                        else {
                            NotiAnimation('error', 'change password fail', 'Đổi mật khẩu không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'change password fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
                    })
            } else {
                // NotiAnimation('error', 'login fail', 'Vui lòng điền đầy đủ thông tin', 'red', 'bottomRight');
            }
        })
    };

    const { getFieldDecorator } = props.form;
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    }
    return (

        <Form
            onSubmit={handleSubmitForm}
            id="fromChangePassword"
            className="form-changepassword"
            {...formItemLayout}

        >

            <Form.Item label="Mật khẩu hiện tại">
                {getFieldDecorator("currentpassword", {
                    rules: [
                        {
                            required: true,
                            message: 'Vui lòng điền mật khẩu hiện tại.'
                        }
                    ]
                })
                    (<Input.Password autoComplete="off" />)
                }
            </Form.Item>
            <Form.Item label="Mật khẩu mới">
                {getFieldDecorator("newpassword", {
                    rules: [
                        {
                            required: true,
                            message: "Vui lòng điền mật khẩu mới.",
                        },
                        {
                            validator: validateToNextPassword
                        }

                    ],
                })
                    (<Input.Password autoComplete="off" />)
                }
            </Form.Item>
            <Form.Item label="Xác nhận mật khẩu">
                {getFieldDecorator("confirmpassword", {
                    rules: [
                        {
                            required: true,
                            message: "Vui lòng điền xác nhận mật khẩu.",
                        },
                        {
                            validator: compareToFirstPassword
                        }
                    ],
                })
                    (<Input.Password autoComplete="off" />)
                }
            </Form.Item>
        </Form>
    )
}

const CHANGE_PASSWORD = gql`
    mutation changePassword(
		$_id: String!
		$currentpassword: String!
		$password: String!
	) {
		changePassword(
			_id: $_id
			currentpassword: $currentpassword
			password: $password
		)
	}
`

export default graphql(CHANGE_PASSWORD, {
    name: 'changePasswordUser'
})(FormChangePassword);
