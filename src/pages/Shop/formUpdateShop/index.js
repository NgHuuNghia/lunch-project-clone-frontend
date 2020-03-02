import { Form, Input, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import React from "react";
import { graphql } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'
import NotiAnimation from "../../../components/shared/NotiAnimation";
import gql from 'graphql-tag'
import Loading from "../../../components/shared/loading";

const FormUpdateShop = props => {
    const { data, loading, } = useQuery(GET_SHOP, { variables: { _id: props.idEdit }, fetchPolicy: "network-only" })
    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { shopname, isActive } = values
                const input = {
                    name: shopname,
                    isActive
                }
                props.UpdateShop({
                    variables: {
                        _id: props.idEdit,
                        input
                    },
                    refetchQueries: () => {
                        return [{ query: GET_ALL_SHOPS, variables: {siteId: props.currentSite}  }]
                    },
                    awaitRefetchQueries: true
                })
                    .then(res => {
                        if (res.data.updateShop) {
                            props.onCloseDrawerUpdate()
                            NotiAnimation('success', 'update shop success', `Cập nhập shop thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'update shop fail', 'cập nhập shop mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'update shop fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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
    if (loading) return <Loading />

    return !data && !data.shop ? <Loading /> : (
        <Form
            onSubmit={handleSubmitForm}
            id="formUpdateShop"
            className="form-newshop"
            {...formItemLayout}

        >

            <Form.Item label="shop name">
                {getFieldDecorator("shopname", {
                    initialValue: data.shop.name,
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
           
            <Form.Item label="Public">
                {getFieldDecorator('isActive', {
                    valuePropName: 'checked',
                    initialValue: data.shop.isActive,
                }
                )(
                    <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                />
                )}

            </Form.Item>


        </Form>
    )
}


const GET_SHOP = gql`
    query getShop($_id: String!){
        shop(_id: $_id) {
            name
            isActive
        }
    }
`
const UPDATE_SHOP = gql`
    mutation updateShop($_id: String! $input: UpdateShopInput!) {
        updateShop(_id: $_id input: $input)
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
export default graphql(UPDATE_SHOP, {
    name: 'UpdateShop',
    options: props => ({
        variables: {
            _id: props._id,
            input: props.input
        }
    })
})(FormUpdateShop);