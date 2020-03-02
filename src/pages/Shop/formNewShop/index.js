import { Form, Input } from "antd";
import React from "react";
import { graphql } from 'react-apollo'
import NotiAnimation from "../../../components/shared/NotiAnimation";
import gql from 'graphql-tag'

const FormNewShop = props => {
    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { shopname } = values
                const input = {
                    name: shopname,
                    siteId: props.currentSite
                }
                props.createNewShop({
                    variables: {
                        input
                    },
                    refetchQueries: [{ query: GET_ALL_SHOPS, variables: {siteId: props.currentSite}  }]
                })
                    .then(res => {
                        if (res.data.createShop) {
                            props.onCloseDrawer()
                            NotiAnimation('success', 'add new shop success', `Thêm thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'add new shop fail', 'Tạo shop mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'add new shop fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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
            id="formNewShop"
            className="form-newshop"
            {...formItemLayout}

        >

            <Form.Item label="shop name">
                {getFieldDecorator("shopname", {
                    rules: [
                        {
                            required: true,
                            message: 'Vui lòng điền shop name.'
                        }
                    ]
                })
                    (<Input autoComplete="off" />)
                }
            </Form.Item>

        </Form>
    )
}

const CREATE_SHOP = gql`
    mutation( $input: CreateShopInput!) {
        createShop(	input: $input ) {
            _id
            name
            isActive
            siteId
        }
    }
`
const GET_ALL_SHOPS = gql`
    query ($siteId: String!) {
        shopInSite (siteId: $siteId) {
            _id
            name
            isActive
            siteId
        }
    }
`

export default graphql(CREATE_SHOP, {
    name: 'createNewShop',
    options: props => ({
        variables: {
            input: props.input
        }
    })
})(FormNewShop)