import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import Loading from '../../components/shared/loading'
import MenuAgGrid from './menuAgGrid/index'
import gql from 'graphql-tag'
const titlePage = 'Quản lí Thực đơn'

const Menu = (props) => {
    const [title, ] = useState(document.title);
    useEffect(() => {
        document.title = titlePage;
    }, [title]);

    const { data, loading,  } = useQuery(GET_ALL_MENUS, { variables: { siteId: props.currentSite},fetchPolicy: "network-only" })
    const [menus, setMenus] = useState([])
    useEffect(() => {
        if(data && data.menusBySite) {
            setMenus(data.menusBySite)
        }
    }, [data])

    if (loading) {
        return (<Loading />)
    }
    else {
        return !data || !data.menusBySite ? <Loading/> :  (
            <div style={{ backgroundColor: "#FFF", height: '100%' }}>
                <div className="title-header" style={{ backgroundColor: "#F7F7F8", width: '100vw', height: '40px', boxShadow: '0 4px 2px -2px #D4D4D4', padding: '10px 50px', fontWeight: 'bold' }}> Manage Menus </div>
                <MenuAgGrid currentSite={props.currentSite} rowData={menus}/>
            </div>
        )
    }
}

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

export default Menu