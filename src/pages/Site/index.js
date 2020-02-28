import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import Loading from '../../components/shared/loading'
import SiteAgGrid from './siteAgGrid/index'
import gql from 'graphql-tag'
const titlePage = 'Quản lí địa chỉ'

const Site = (props) => {
    const [title, ] = useState(document.title);
    useEffect(() => {
        document.title = titlePage;
    }, [title]);

    const { data, loading,  } = useQuery(GET_ALL_SITES, { fetchPolicy: "network-only" })
    const [sites, setSites] = useState([])
    useEffect(() => {
        if(data && data.sites) {
            setSites(data.sites)
        }
    }, [data])

       
    if (loading) {
        return (<Loading />)
    }
    else {
        return !data || !data.sites ? <Loading/> :  (
            <div style={{ backgroundColor: "#FFF", height: '100%' }}>
                <div className="title-header" style={{ backgroundColor: "#F7F7F8", width: '100vw', height: '40px', boxShadow: '0 4px 2px -2px #D4D4D4', padding: '10px 50px', fontWeight: 'bold' }}> Manage Sites </div>
                <SiteAgGrid rowData={sites}/>
            </div>
        )
    }
}

const GET_ALL_SITES = gql`
    query {
        sites {
            _id
            name
        }
    }
`

export default Site