import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import Loading from '../../components/shared/loading'
import NotFoundPage from '../../components/error/notFoundPage/index'
import DishMenuAgGrid from './dishMenuAgGrid/index'
import gql from 'graphql-tag'
const titlePage = 'Quản lí Món ăn Trong Menu'

const DishMenu = (props) => {
    const { menuId,shopId } = useParams() //siteId not use
    const [title, ] = useState(document.title);
    useEffect(() => {
        document.title = titlePage;
    }, [title]);
    const { data: dataS, loading: landingS, error: errorS } = useQuery(GET_MENU, { variables: { id: menuId }, fetchPolicy: "network-only" })
    const { data, loading, error } = useQuery(GET_ALL_DISH_MENUS, { variables: { menuId },fetchPolicy: "network-only" })
    const [dishMenus, setDishMenus] = useState([])
    useEffect(() => {
        if(data && data.dishesByMenu) {
            setDishMenus(data.dishesByMenu)
        }
    }, [data])

    if(error || errorS) {
        return <NotFoundPage/>
    }
    if (loading || landingS) {
        return (<Loading />)
    }
    else {
        return !data && !data.dishesByMenu && !dataS && !dataS.menu ? <Loading/> :  (
            <div style={{ backgroundColor: "#FFF", height: '100%' }}>
                <div className="title-header" style={{ backgroundColor: "#F7F7F8", width: '100vw', height: '40px', boxShadow: '0 4px 2px -2px #D4D4D4', padding: '10px 50px', fontWeight: 'bold' }}> Manage DishMenus By Menu {dataS.menu.name} </div>
                <DishMenuAgGrid shopId={shopId} menuId={menuId} rowData={dishMenus}/>
            </div>
        )
    }
}

const GET_MENU = gql`
    query ($id: String!){
        menu(id: $id) {
            name
        }
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

export default DishMenu