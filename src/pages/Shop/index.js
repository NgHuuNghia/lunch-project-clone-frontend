import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import Loading from '../../components/shared/loading'
import ShopAgGrid from './shopAgGrid/index'
import gql from 'graphql-tag'
const titlePage = 'Quản lí Cửa hàng'

const Shop = (props) => {
    const [title, ] = useState(document.title);
    useEffect(() => {
        document.title = titlePage;
    }, [title]);

    const { data, loading,  } = useQuery(GET_ALL_SHOPS, { variables: { siteId: props.currentSite},fetchPolicy: "network-only" })
    const [shops, setShops] = useState([])
    useEffect(() => {
        if(data && data.shopInSite) {
            setShops(data.shopInSite)
        }
    }, [data])

    if (loading) {
        return (<Loading />)
    }
    else {
        return !data || !data.shopInSite ? <Loading/> :  (
            <div style={{ backgroundColor: "#FFF", height: '100%' }}>
                <div className="title-header" style={{ backgroundColor: "#F7F7F8", width: '100vw', height: '40px', boxShadow: '0 4px 2px -2px #D4D4D4', padding: '10px 50px', fontWeight: 'bold' }}> Manage Shops </div>
                <ShopAgGrid currentSite={props.currentSite} rowData={shops}/>
            </div>
        )
    }
}

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

export default Shop