import { Form, Select, InputNumber } from "antd";
import React from "react";
import { graphql } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'
import NotiAnimation from "../../../components/shared/NotiAnimation";
import gql from 'graphql-tag'
import Loading from "../../../components/shared/loading";
const { Option } = Select

const FormUpdateDishMenu = props => {
    const { data, loading, } = useQuery(GET_DISH_MENU, { variables: { _id: props.idEdit }, fetchPolicy: "network-only" })
    const { data: dataS, loading: loadingS, } = useQuery(GET_ALL_DISHS, { variables: { shopId: props.shopId }, fetchPolicy: "network-only" })

    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { dishMenuname, count } = values

                props.UpdateDishMenu({
                    variables: {
                        _id: props.idEdit,
                        name: dishMenuname,
                        count
                    },
                    refetchQueries: () => {
                        return [{ query: GET_ALL_DISH_MENUS, variables: { menuId: props.menuId } }]
                    },
                    awaitRefetchQueries: true
                })
                    .then(res => {
                        if (res.data.updateDishMenu) {
                            props.onCloseDrawerUpdate()
                            NotiAnimation('success', 'update dishMenu success', `Cập nhập dishMenu thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'update dishMenu fail', 'cập nhập dishMenu mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'update dishMenu fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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
    if (loading || loadingS) return <Loading />

    return !data && !data.dishMenu && !dataS && !dataS.dishesByShop ? <Loading /> : (
        <Form
            onSubmit={handleSubmitForm}
            id="formUpdateDishMenu"
            className="form-newdishMenu"
            {...formItemLayout}

        >

            <Form.Item label="dishmenu name">
                {getFieldDecorator("dishMenuname", {
                    initialValue: `${data.dishMenu.name}`,
                    rules: [
                        {
                            required: true,
                        }
                    ]
                })
                    (<Select
                        style={{ width: "277px" }}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            dataS.dishesByShop && dataS.dishesByShop.map((dish, i) => <Option key={dish._id} value={dish.name}>{dish.name}</Option>)
                        }

                    </Select>)
                }
            </Form.Item>

            <Form.Item label="count">
                {getFieldDecorator("count", {
                    initialValue: data.dishMenu.count,
                    rules: [
                        {
                            required: true,
                        }
                    ]
                })
                    (<InputNumber min={0} max={50} />)
                }
            </Form.Item>



        </Form>
    )
}

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

const GET_DISH_MENU = gql`
    query getDishMenu($_id: String!){
        dishMenu(_id: $_id) {
            name
            count
        }
    }
`
const UPDATE_DISH_MENU = gql`
    mutation updateDishMenu($_id: String!, $name: String!, $count: Int!) {
        updateDishMenu(_id: $_id, name: $name, count: $count)
    }
`

const GET_ALL_DISH_MENUS = gql`
    query ($menuId: String!) {
        dishesByMenu (menuId: $menuId) {
            _id
            name
            count
            orderCount
        }
    }
`

export default graphql(UPDATE_DISH_MENU, {
    name: 'UpdateDishMenu',
    options: props => ({
        variables: {
            _id: props._id,
            name: props.name,
            count: props.count
        }
    })
})(FormUpdateDishMenu);