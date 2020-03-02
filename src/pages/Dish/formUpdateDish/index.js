import { Form, Input, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import React from "react";
import { graphql } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'
import NotiAnimation from "../../../components/shared/NotiAnimation";
import gql from 'graphql-tag'
import Loading from "../../../components/shared/loading";

const FormUpdateDish = props => {
    const { data, loading, } = useQuery(GET_DISH, { variables: { _id: props.idEdit }, fetchPolicy: "network-only" })
    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { dishname, isActive } = values

                props.UpdateDish({
                    variables: {
                        _id: props.idEdit,
                        name: dishname,
                        isActive
                    },
                    refetchQueries: () => {
                        return [{ query: GET_ALL_DISHS, variables: {shopId: props.shopId}  }]
                    },
                    awaitRefetchQueries: true
                })
                    .then(res => {
                        if (res.data.updateDish) {
                            props.onCloseDrawerUpdate()
                            NotiAnimation('success', 'update dish success', `Cập nhập dish thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'update dish fail', 'cập nhập dish mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'update dish fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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

    return !data && !data.dish ? <Loading /> : (
        <Form
            onSubmit={handleSubmitForm}
            id="formUpdateDish"
            className="form-newdish"
            {...formItemLayout}

        >

            <Form.Item label="dish name">
                {getFieldDecorator("dishname", {
                    initialValue: data.dish.name,
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
           
            <Form.Item label="Public">
                {getFieldDecorator('isActive', {
                    valuePropName: 'checked',
                    initialValue: data.dish.isActive,
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


const GET_DISH = gql`
    query getDish($_id: String!){
        dish(_id: $_id) {
            name
            isActive
        }
    }
`
const UPDATE_DISH = gql`
    mutation updateDish($_id: String!, $name: String!, $isActive: Boolean!) {
        updateDish(_id: $_id, name: $name, isActive: $isActive)
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
export default graphql(UPDATE_DISH, {
    name: 'UpdateDish',
    options: props => ({
        variables: {
            _id: props._id,
            name: props.name,
            isActive: props.isActive
        }
    })
})(FormUpdateDish);