import { Form, Input } from "antd";
import React from "react";
import { graphql } from 'react-apollo'
import NotiAnimation from "../../components/shared/NotiAnimation";
import gql from 'graphql-tag'

const FormNewSite = props => {

    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { sitename } = values
                const input = {
                    name: sitename
                }
                props.createNewSite({
                    variables: {
                        input
                    },
                    refetchQueries: [{ query: GET_ALL_SITES }]
                })
                    .then(res => {
                        if (res.data.createSite) {
                            props.onCloseDrawer()
                            NotiAnimation('success', 'add new site success', `Thêm thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'add new site fail', 'Tạo site mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'add new site fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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
            id="formNewSite"
            className="form-newsite"
            {...formItemLayout}

        >

            <Form.Item label="site name">
                {getFieldDecorator("sitename", {
                    rules: [
                        {
                            required: true,
                            message: 'Vui lòng điền site name.'
                        }
                    ]
                })
                    (<Input autoComplete="off" />)
                }
            </Form.Item>

        </Form>
    )
}

const CREATE_SITE = gql`
    mutation( $input: CreateSiteInput!) {
        createSite(	input: $input ) {
            _id
            name
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

export default graphql(CREATE_SITE, {
    name: 'createNewSite',
    options: props => ({
        variables: {
            input: props.input
        }
    })
})(FormNewSite);