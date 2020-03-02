import { Form, Input, Select } from "antd";
import React, { useState, useEffect } from  "react";
import { useQuery } from '@apollo/react-hooks'
import { graphql } from 'react-apollo'
import NotiAnimation from "../../../components/shared/NotiAnimation";
import Loading from '../../../components/shared/loading'
import gql from 'graphql-tag'
const { Option } = Select;
const FormNewMenu = props => {

    const { data, loading, } = useQuery(GET_ALL_SHOPS, { variables: { siteId: props.currentSite }, fetchPolicy: "network-only" })
    const [shops, setSites] = useState(null)
    useEffect(() => {
        if (data && data.shopInSite) {
            setSites(data.shopInSite)
        }
    }, [data])

    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const { menuname, shopId } = values

                props.createNewMenu({
                    variables: {
                        name: menuname,
                        siteId: props.currentSite,
                        shopId
                    },
                    refetchQueries: [{ query: GET_ALL_MENUS, variables: { siteId: props.currentSite } }]
                })
                    .then(res => {
                        if (res.data.createMenu) {
                            props.onCloseDrawer()
                            NotiAnimation('success', 'add new menu success', `Thêm thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'add new menu fail', 'Tạo menu mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'add new menu fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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
    if (loading) {
        return (<Loading />)
    }
    else {

        return shops === null ? <Loading /> : shops.length ===0 ? <div> Khu vực này chưa có shop nào ! </div> : (

            <Form
                onSubmit={handleSubmitForm}
                id="formNewMenu"
                className="form-newmenu"
                {...formItemLayout}

            >

                <Form.Item label="menu name">
                    {getFieldDecorator("menuname", {
                        rules: [
                            {
                                required: true,
                                message: 'Vui lòng điền menu name.'
                            }
                        ]
                    })
                        (<Input autoComplete="off" />)
                    }
                </Form.Item>

                <Form.Item label="shop name">
                    {getFieldDecorator("shopId", {
                        initialValue: `${shops[0]._id}`,
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
                                shops && shops.map((shop, i) => <Option key={shop._id} value={shop._id}>{shop.name}</Option>)
                            }

                        </Select>)
                    }
                </Form.Item>

            </Form>
        )
    }
}

const CREATE_MENU = gql`
    mutation( $name: String! $siteId: String! $shopId: String!) {
        createMenu(	name: $name siteId: $siteId shopId: $shopId)
    }
`
const GET_ALL_MENUS = gql`
    query ($siteId: String!) {
        menusBySite (siteId: $siteId) {
            _id
            name
            siteId
            shopId
            isActive
            isPublic
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

export default graphql(CREATE_MENU, {
    name: 'createNewMenu',
    options: props => ({
        variables: {
            input: props.input
        }
    })
})(FormNewMenu)