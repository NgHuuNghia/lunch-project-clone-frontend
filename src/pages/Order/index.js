import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import Loading from '../../components/shared/loading'
import NotFoundPage from '../../components/error/notFoundPage/index'
import OrderAgGrid from './orderAgGrid/index'
import gql from 'graphql-tag'
const titlePage = 'Đặt Món'

const Order = (props) => {
    const [title, ] = useState(document.title);
    useEffect(() => {
        document.title = titlePage;
    }, [title]);
    const { data, loading, error } = useQuery(GET_ALL_DISH_MENUS_PUBLISH, { fetchPolicy: "network-only" })
    const [dishMenus, setDishMenus] = useState([])
    useEffect(() => {
        if(data && data.dishesByMenuPublished) {
            setDishMenus(data.dishesByMenuPublished)
        }
    }, [data])

    if(error ) {
        return <NotFoundPage/>
    }
    if (loading) {
        return (<Loading />)
    }
    else {
        return !data && !data.dishesByMenuPublished ? <Loading/> :  (
            <div style={{ backgroundColor: "#FFF", height: '100%' }}>
                <div className="title-header" style={{ backgroundColor: "#F7F7F8", width: '100vw', height: '40px', boxShadow: '0 4px 2px -2px #D4D4D4', padding: '10px 50px', fontWeight: 'bold' }}> Đặt Món </div>
                <OrderAgGrid  rowData={dishMenus}/>
            </div>
        )
    }
}

const GET_ALL_DISH_MENUS_PUBLISH = gql`
    query {
        dishesByMenuPublished {
            _id
            name
            count
            orderCount
        }
    }
`

export default Order