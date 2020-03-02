import { Form, Input } from "antd";
import React from "react";
import { graphql } from 'react-apollo'
import NotiAnimation from "../../../components/shared/NotiAnimation";
import gql from 'graphql-tag'

const FormNewDish = props => {
    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { dishname } = values
                props.createNewDish({
                    variables: {
                        name: dishname,
                        shopId: props.shopId
                    },
                    refetchQueries: [{ query: GET_ALL_DISHS, variables: {shopId: props.shopId}  }]
                })
                    .then(res => {
                        if (res.data.createDish) {
                            props.onCloseDrawer()
                            NotiAnimation('success', 'add new dish success', `Thêm thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'add new dish fail', 'Tạo dish mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'add new dish fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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
            id="formNewDish"
            className="form-newdish"
            {...formItemLayout}

        >

            <Form.Item label="dish name">
                {getFieldDecorator("dishname", {
                    rules: [
                        {
                            required: true,
                            message: 'Vui lòng điền dish name.'
                        }
                    ]
                })
                    (<Input autoComplete="off" />)
                }
            </Form.Item>

        </Form>
    )
}

const CREATE_DISH = gql`
    mutation( $name: String!, $shopId: String!) {
        createDish(	name: $name, shopId: $shopId )
    }
`
const GET_ALL_DISHS = gql`
    query ($shopId: String!) {
        dishesByShop (shopId: $shopId) {
            _id
            name
            shopId
            isActive
        }
    }
`

export default graphql(CREATE_DISH, {
    name: 'createNewDish',
    options: props => ({
        variables: {
            input: props.input
        }
    })
})(FormNewDish)