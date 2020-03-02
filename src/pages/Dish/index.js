import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import Loading from '../../components/shared/loading'
import NotFoundPage from '../../components/error/notFoundPage/index'
import DishAgGrid from './dishAgGrid/index'
import gql from 'graphql-tag'
const titlePage = 'Quản lí Món ăn'

const Dish = (props) => {
    const { shopId } = useParams() //siteId not use
    const [title, ] = useState(document.title);
    useEffect(() => {
        document.title = titlePage;
    }, [title]);
    const { data: dataS, error: errorS, loading: landingS } = useQuery(GET_SHOP, { variables: { _id: shopId }, fetchPolicy: "network-only" })
    const { data, loading, error } = useQuery(GET_ALL_DISHS, { variables: { shopId },fetchPolicy: "network-only" })
    const [dishs, setDishs] = useState([])
    useEffect(() => {
        if(data && data.dishesByShop) {
            setDishs(data.dishesByShop)
        }
    }, [data])

    if(error || errorS) {
        return <NotFoundPage/>
    }
    if (loading || landingS) {
        return (<Loading />)
    }
    else {
        return !data || !data.dishesByShop || !dataS || !dataS.shop ? <Loading/> :  (
            <div style={{ backgroundColor: "#FFF", height: '100%' }}>
                <div className="title-header" style={{ backgroundColor: "#F7F7F8", width: '100vw', height: '40px', boxShadow: '0 4px 2px -2px #D4D4D4', padding: '10px 50px', fontWeight: 'bold' }}> Manage Dishs By Shop {dataS.shop.name} </div>
                <DishAgGrid shopId={shopId} rowData={dishs}/>
            </div>
        )
    }
}

const GET_SHOP = gql`
    query ($_id: String!){
        shop(_id: $_id) {
            name
            isActive
        }
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

export default Dish