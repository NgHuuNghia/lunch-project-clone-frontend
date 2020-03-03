import { Form, InputNumber, Select } from "antd";
import React from "react";
import { useQuery } from '@apollo/react-hooks'
import { graphql } from 'react-apollo'
import NotiAnimation from "../../../components/shared/NotiAnimation";
import NotFoundPage from '../../../components/error/notFoundPage/index'
import gql from 'graphql-tag'
import Loading from "../../../components/shared/loading";
const { Option } = Select

const FormNewDishMenu = props => {
    const { data, loading, error } = useQuery(GET_ALL_DISHS, { variables: { shopId: props.shopId }, fetchPolicy: "network-only" })
    // get name dish from shopId
    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { dishMenuname, count } = values
                props.createNewDishMenu({
                    variables: {
                        name: dishMenuname,
                        count,
                        menuId: props.menuId
                    },
                    refetchQueries: [{ query: GET_ALL_DISH_MENUS, variables: { menuId: props.menuId } }]
                })
                    .then(res => {
                        if (res.data.createDishMenu) {
                            props.onCloseDrawer()
                            NotiAnimation('success', 'add new dishMenu success', `Thêm thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'add new dishMenu fail', 'Tạo dishMenu mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'add new dishMenu fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
                    })
            } else {
                // NotiAnimation('error', 'login fail', 'Vui lòng điền đầy đủ thông tin', 'red', 'bottomRight');
            }
        })
    };
    if (loading) return <Loading />
    if(error) {
        return <NotFoundPage/>
    }
    const { getFieldDecorator } = props.form;
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    }
    return !data && !data.dishesByShop ? <Loading /> : (

        <Form
            onSubmit={handleSubmitForm}
            id="formNewDishMenu"
            className="form-newdishMenu"
            {...formItemLayout}

        >

            <Form.Item label="dishmenu name">
                {getFieldDecorator("dishMenuname", {
                    initialValue: `${data.dishesByShop[0].name}`,
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
                            data.dishesByShop && data.dishesByShop.map((dish, i) => <Option key={dish._id} value={dish.name}>{dish.name}</Option>)
                        }

                    </Select>)
                }
            </Form.Item>

            <Form.Item label="count">
                {getFieldDecorator("count", {
                    initialValue: 0,
                    rules: [
                        {
                            required: true,
                        }
                    ]
                })
                    (<InputNumber min={0} max={50}  />)
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

const CREATE_DISH_MENU = gql`
    mutation( $name: String!, $count: Int!, $menuId: String!) {
        createDishMenu(	name: $name, count: $count, menuId: $menuId )
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


export default graphql(CREATE_DISH_MENU, {
    name: 'createNewDishMenu',
    options: props => ({
        variables: {
            input: props.input
        }
    })
})(FormNewDishMenu)