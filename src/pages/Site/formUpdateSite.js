import { Form, Input } from "antd";
import React from "react";
import { graphql } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'
import NotiAnimation from "../../components/shared/NotiAnimation";
import gql from 'graphql-tag'
import Loading from "../../components/shared/loading";

const FormUpdateSite = props => {
    const { data, loading,  } = useQuery(GET_SITE, { variables: { _id: props.idEdit }, fetchPolicy: "cache-and-network" })
    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { sitename } = values
                const input = {
                    name: sitename
                }
                props.UpdateSite({
                    variables: {
                        _id: props.idEdit,
                        input
                    },
                    refetchQueries: () => {
                        return [{ query: GET_ALL_SITES }]
                     },
                     awaitRefetchQueries:true
                })
                    .then(res => {
                        if (res.data.updateSite) {
                            props.onCloseDrawerUpdate()
                            NotiAnimation('success', 'update site success', `Cập nhập site thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'update site fail', 'cập nhập site mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'update site fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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
    if(loading) return <Loading/> 

    return !data && !data.site ? <Loading/> : (
        <Form
            onSubmit={handleSubmitForm}
            id="formUpdateSite"
            className="form-newsite"
            {...formItemLayout}

        >

            <Form.Item label="site name">
                {getFieldDecorator("sitename", {
                    initialValue: data.site.name,
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


const GET_SITE = gql`
    query getSite($_id: String!){
        site(_id: $_id) {
            name
        }
    }
`
const UPDATE_SITE = gql`
    mutation updateSite($_id: String! $input: UpdateSiteInput!) {
        updateSite(_id: $_id input: $input)
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
export default graphql(UPDATE_SITE, {
    name: 'UpdateSite',
    options: props => ({
        variables: {
            _id: props._id,
            input: props.input
        }
    })
})(FormUpdateSite);