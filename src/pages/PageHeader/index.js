import { Dropdown, Icon, Menu, Select } from 'antd'
import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import avt from '../../assets/images/avatar.png'
import logo from '../../assets/images/logo-acexis.png'
import Loading from '../../components/shared/loading'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import './index.css'
const { Option } = Select

const PageHeader = (props) => {
    const { data, loading, error } = useQuery(GET_ALL_SITES)
    const [sites, setSites] = useState(null)
    const LoadOnceCurrentSites = useRef(false);
    const [locale, setLocale] = useState('VN');
    const changeSite = (value) => {
        props.setCurrentSite(value)
    }

    function changeLocale({ key }) {
        if (key === 'VN') {
            setLocale('VN')
        } else {
            setLocale('EN')
        }
    }
    const languages = (
        <Menu onClick={changeLocale}>
            <Menu.Item key="VN" value="VN">
                <span role="img" aria-label="vi">
                    🇻🇳
				</span>
            </Menu.Item>
            <Menu.Item key="EN" value="EN">
                <span role="img" aria-label="en">
                    🇬🇧
				</span>
            </Menu.Item>
        </Menu>
    )
    if (error) {
        return <div>page not found</div>
    }
    else if (loading) {
        return (<Loading />)
    }
    else {
        if (!LoadOnceCurrentSites.current) {
            setSites(data.sites)
            LoadOnceCurrentSites.current = true;
        }
        return sites === null ? <Loading /> : (
            <div className="Header" >
                <Menu className="header-menu" mode="horizontal" style={{ padding: '2px' }} >
                    <Menu.Item key="avatar" className="avatar header-item" style={{ marginLeft: '3%' }}>
                        <img onClick={props.toggleWrapper} src={avt} alt="" style={{ width: '2em', height: '2em', marginBottom: '10px' }} />
                    </Menu.Item>
                    <Menu.Item key="back-button" className="back-button header-item" >
                        <Link to="#"><Icon type="left" /></Link>
                    </Menu.Item>
                    <Menu.Item key="home-button" className="home-button header-item" >
                        <Link to="/"><Icon type="home" style={{ fontSize: '24px' }} /></Link>
                    </Menu.Item>
                    <Menu.Item key="logo-header" className="logo-header header-item" style={{ width: '150px' }} >
                        <img src={logo} alt="" style={{ width: '100%', height: '100%' }} />
                    </Menu.Item>
                    <Menu.Item key="location-combobox" className="menu-location header-item" >
                        <Select
                            className='location-combobox'
                            defaultValue={props.site}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={changeSite}
                        >
                            {
                                sites && sites.map((site, i) => <Option key={site._id} value={site._id}>{site.name}</Option>)
                            }
                        </Select>
                    </Menu.Item>
                    <Menu.Item className="language-combobox header-item" style={{ float: 'right' }}>
                        <Dropdown
                            key="3"
                            overlay={languages}
                            placement="bottomCenter"
                        >
                            <div
                                style={{
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    marginTop: 2
                                }}
                            >
                                {locale}
                            </div>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
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

export default PageHeader;
