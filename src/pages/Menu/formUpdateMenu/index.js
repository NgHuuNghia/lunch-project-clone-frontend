import { Form, Input, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import React from "react";
import { graphql } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'
import NotiAnimation from "../../../components/shared/NotiAnimation";
import gql from 'graphql-tag'
import Loading from "../../../components/shared/loading";

const FormUpdateMenu = props => {
    const { data, loading, } = useQuery(GET_MENU, { variables: { id: props.idEdit }, fetchPolicy: "network-only" })
    const handleSubmitForm = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {

                const { menuname, isActive } = values

                props.UpdateMenu({
                    variables: {
                        id: props.idEdit,
                        name: menuname,
                        isActive
                    },
                    refetchQueries: () => {
                        return [{ query: GET_ALL_MENUS, variables: {siteId: props.currentSite}  }]
                    },
                    awaitRefetchQueries: true
                })
                    .then(res => {
                        if (res.data.updateMenu) {
                            props.onCloseDrawerUpdate()
                            NotiAnimation('success', 'update menu success', `Cập nhập menu thành công!`, 'green', 'bottomRight');
                        }
                        else {
                            NotiAnimation('error', 'update menu fail', 'cập nhập menu mới không thành công', 'red', 'bottomRight');
                        }
                    })
                    .catch(err1 => {
                        NotiAnimation('error', 'update menu fail', err1.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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

    return !data && !data.menu ? <Loading /> : (
        <Form
            onSubmit={handleSubmitForm}
            id="formUpdateMenu"
            className="form-newmenu"
            {...formItemLayout}

        >

            <Form.Item label="menu name">
                {getFieldDecorator("menuname", {
                    initialValue: data.menu.name,
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
           
            <Form.Item label="Public">
                {getFieldDecorator('isActive', {
                    valuePropName: 'checked',
                    initialValue: data.menu.isActive,
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


const GET_MENU = gql`
    query getMenu($id: String!){
        menu(id: $id) {
            name
            isActive
        }
    }
`
const UPDATE_MENU = gql`
    mutation updateMenu($id: String! $name: String! $isActive: Boolean!) {
        updateMenu(id: $id name: $name isActive: $isActive)
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

export default graphql(UPDATE_MENU, {
    name: 'UpdateMenu',
    options: props => ({
        variables: {
            id: props.id,
            name: props.name,
            isActive: props.isActive
        }
    })
})(FormUpdateMenu);