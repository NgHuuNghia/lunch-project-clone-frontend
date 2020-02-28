import React, { useState, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { useQuery } from '@apollo/react-hooks'
import { graphql } from 'react-apollo'
import Actions from './siteActions/index'
import Loading from '../../components/shared/loading'
import NotiAnimation from "../../components/shared/NotiAnimation";
import FormNewSite from './formNewSite'
import FormUpdateSite from './formUpdateSite'
import gql from 'graphql-tag'
import { Select, Icon, Tooltip, Drawer, Button, Form } from 'antd';
import { useEffect } from 'react';
const { Option } = Select;

const Site = (props) => {
    const [isShowDrawer, setIsShowDrawer] = useState(false)
    const [isShowDrawerUpdate, setIsShowDrawerUpdate] = useState(false)
    const [idEdit, setIdEdit] = useState(null)
    const WrappedNormalNewSiteForm = Form.create({ name: 'normal_newsite' })(FormNewSite);
    const WrappedNormalUpdateSiteForm = Form.create({ name: 'normal_updatesite' })(FormUpdateSite);
    const { data, loading, error } = useQuery(GET_ALL_SITES, { fetchPolicy: "network-only" })

    const LoadOnceCurrentSites = useRef(false);
    const [gridApi, setGridApi] = useState()
    const columnDefs = [
        { headerName: "STT", field: "id", checkboxSelection: true, maxWidth: 80, },
        { headerName: "Site Name", field: "name", },
        {
            headerName: 'Action',
            cellRenderer: 'Actions',
            cellRendererParams: {
                onEdit,
                onDelete
            },
            filter: false,
        }
    ]

    const [rowData, setrowData] = useState([])
    useEffect(() => {
        try {
            setrowData(data.sites)
        }
        catch(err) {

        }
    },[data])
    const [rowElement, setrowElement] = useState({ firt: 1, last: rowData.length < 10 ? rowData.length : 10 })
    const [pageElement, setPageElement] = useState({ firt: 1, last: Math.ceil(rowData.length / 10) })

    const getRowHeight = (params) => {
        if (params.node.level === 0) {
            return 31;
        } else {
            return 25;
        }
    }
    const onFirstDataRendered = (params) => {
        const { api } = params;
        setGridApi(api);
        params.api.sizeColumnsToFit()
    }

    const onPageSizeChanged = (newPageSize) => {
        gridApi.paginationSetPageSize(Number(newPageSize));
        const currentPageNumber = gridApi.paginationGetCurrentPage() + 1
        setrowElement({ firt: 1, last: rowData.length > newPageSize ? newPageSize : rowData.length })
        setPageElement({ firt: currentPageNumber, last: Math.ceil(rowData.length / newPageSize) })
    }
    const previousPage = () => {
        const previousPageNumber = gridApi.paginationGetCurrentPage()
        gridApi.paginationGoToPreviousPage()
        const firtRowElement = gridApi.paginationGetPageSize() * gridApi.paginationGetCurrentPage() + 1
        const lastRowElement = gridApi.paginationGetPageSize() * gridApi.paginationGetCurrentPage() + gridApi.paginationGetPageSize() < gridApi.paginationGetRowCount() ? gridApi.paginationGetPageSize() * gridApi.paginationGetCurrentPage() + gridApi.paginationGetPageSize() : gridApi.paginationGetRowCount()
        if (previousPageNumber > 0) {
            setPageElement({ firt: previousPageNumber, last: pageElement.last })
            setrowElement({ firt: firtRowElement, last: lastRowElement })
        }
    }
    const nextPage = () => {
        gridApi.paginationGoToNextPage()
        const nextPageNumber = gridApi.paginationGetCurrentPage() + 1
        const firtRowElement = gridApi.paginationGetPageSize() * gridApi.paginationGetCurrentPage() + 1
        const lastRowElement = gridApi.paginationGetPageSize() * gridApi.paginationGetCurrentPage() + gridApi.paginationGetPageSize() < gridApi.paginationGetRowCount() ? gridApi.paginationGetPageSize() * gridApi.paginationGetCurrentPage() + gridApi.paginationGetPageSize() : gridApi.paginationGetRowCount()
        setPageElement({ firt: nextPageNumber, last: pageElement.last })
        setrowElement({ firt: firtRowElement, last: lastRowElement })
    }
    const onCloseDrawer = () => {
        setIsShowDrawer(false)
    }
    const onCloseDrawerUpdate = () => {
        setIsShowDrawerUpdate(false)
    }

    function onDelete(_id) {
        props.DeleteSite({
            variables: {
                _id
            },
            refetchQueries: () => {
               return [{ query: GET_ALL_SITES }]
            },
            awaitRefetchQueries:true

        }).then(res => {
            // gridApi.redrawRows()
            if (res.data.deleteSite) {
                NotiAnimation('error', 'delete site fail', 'Xóa site thành công', 'red', 'bottomRight');
            }
        })
            .catch(err => {
                NotiAnimation('error', 'delete site fail', err.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
            })
    }
    function onEdit(_id) {
        // console.log('on edit', _id);
        setIdEdit(_id)
        setIsShowDrawerUpdate(true)
    }

    if (error) {
        return <div>page not found</div>
    }
    else if (loading) {
        return (<Loading />)
    }
    else {
        if (!LoadOnceCurrentSites.current) {
            setrowData(data.sites)
            setrowElement({ firt: 1, last: data.sites.length < 10 ? data.sites.length : 10 })
            setPageElement({ firt: 1, last: Math.ceil(data.sites.length / 10) })
            LoadOnceCurrentSites.current = true;
        }
        return (
            <div style={{ backgroundColor: "#FFF", height: '100%' }}>
                <div className="title-header" style={{ backgroundColor: "#F7F7F8", width: '100vw', height: '40px', boxShadow: '0 4px 2px -2px #D4D4D4', padding: '10px 50px', fontWeight: 'bold' }}> Manage Sites </div>
                <div className="pagination-manage" style={{ marginTop: 10, marginLeft: 55, fontSize: 13 }}>
                    <span className="selection-status"><strong>Total {rowData.length}</strong> </span>
                    <span className="pagination-status">from {rowElement.firt} to {rowElement.last} </span>
                    <Select defaultValue="10" id='selectSizePage' style={{ margin: '0 7px', width: 60 }} onChange={onPageSizeChanged.bind(this)}>
                        <Option value="10">10</Option>
                        <Option value="25">25</Option>
                        <Option value="50">50</Option>
                    </Select>
                    <span className="pagination-status">rows per page</span>
                    <button disabled={pageElement.firt === 1 ? true : false} onClick={previousPage} style={{ margin: '0 7px', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <Icon style={{ color: pageElement.firt === 1 ? '#d9d9d9' : 'black' }} type="left" />
                    </button>
                    <span className="pagination-page">page {pageElement.firt} of {pageElement.last}</span>
                    <button disabled={pageElement.firt === pageElement.last ? true : false} onClick={nextPage} style={{ margin: '0 7px', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <Icon style={{ color: pageElement.firt === pageElement.last ? '#d9d9d9' : 'black' }} type="right" />
                    </button>
                    <Tooltip placement="bottom" title="add new site">
                        <button className="add" onClick={() => setIsShowDrawer(true)} style={{ margin: '0 50px', border: 'none', background: 'none', cursor: 'pointer', float: 'right' }}>
                            <Icon type="plus" style={{ color: 'blue', fontSize: 20 }} />
                        </button>
                    </Tooltip>
                </div>

                <Drawer
                    title="New Site"
                    width={600}
                    onClose={onCloseDrawer}
                    closable={false}
                    visible={isShowDrawer}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <WrappedNormalNewSiteForm onCloseDrawer={onCloseDrawer} {...props} />
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            height: '44px',
                            borderTop: '1px solid #e9e9e9',
                            padding: '5px 30px',
                            background: '#303C49',
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={onCloseDrawer} style={{ marginRight: 10, background: 'none', color: 'white' }}> Hủy </Button>
                        <Button form="formNewSite" key="submit" htmlType="submit" type="primary"> Lưu </Button>
                    </div>
                </Drawer>

                <Drawer
                    title="Update Site"
                    width={600}
                    onClose={onCloseDrawerUpdate}
                    closable={false}
                    visible={isShowDrawerUpdate}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <WrappedNormalUpdateSiteForm idEdit={idEdit} onCloseDrawerUpdate={onCloseDrawerUpdate} {...props} />
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            height: '44px',
                            borderTop: '1px solid #e9e9e9',
                            padding: '5px 30px',
                            background: '#303C49',
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={onCloseDrawerUpdate} style={{ marginRight: 10, background: 'none', color: 'white' }}> Hủy </Button>
                        <Button form="formUpdateSite" key="submit" htmlType="submit" type="primary"> Lưu </Button>
                    </div>
                </Drawer>

                <div className="ag-theme-balham" style={{ height: '500px', width: '93%', margin: '10px 50px' }}>
                    <AgGridReact
                        modules={AllCommunityModules}
                        rowData={rowData}
                        frameworkComponents={{ Actions }}
                        style={{ borderRight: '1px solid #bdc3c7' }}
                        columnDefs={columnDefs}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            cellStyle: { borderRight: '1px solid #bdc3c7' }
                        }}
                        headerHeight={40}
                        onFirstDataRendered={onFirstDataRendered.bind(this)}
                        pagination={true}
                        suppressPaginationPanel={true}
                        paginationPageSize={10}
                        getRowHeight={getRowHeight}
                        suppressCellSelection={true}
                    >
                    </AgGridReact>
                </div>

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
const DELETE_SITE = gql`
  mutation deleteSite($_id: String!) {
    deleteSite(_id: $_id)
  }
`

export default graphql(DELETE_SITE, {
    name: 'DeleteSite'
})(Site);