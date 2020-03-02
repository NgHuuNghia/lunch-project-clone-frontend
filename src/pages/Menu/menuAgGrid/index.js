import React, { useState, useEffect } from 'react'
import { Select, Icon, Tooltip, Drawer, Button, Form } from 'antd';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Actions from './menuActions/index'
import NotiAnimation from "../../../components/shared/NotiAnimation";
import FormNewMenu from '../formNewMenu/index'
import FormUpdateMenu from '../formUpdateMenu/index'
import { useHistory } from 'react-router-dom';
import { compose } from 'recompose'
const { Option } = Select;

const MenuAgGrid = (props) => {
    const history = useHistory()
    const [rowData, setRowData] = useState(props.rowData)
    const [gridApi, setGridApi] = useState()
    const [idEdit, setIdEdit] = useState(null)


    useEffect(() => {
        setRowData(props.rowData)
    }, [props.rowData])
    useEffect(() => {
        setrowElement({ firt: rowData.length === 0 ? 0 : 1, last: rowData.length < 10 ? rowData.length : 10 })
        setPageElement({ firt: 1, last: rowData.length !== 0 ? Math.ceil(rowData.length / 10) : 1 })
    }, [rowData])

    const WrappedNormalNewMenuForm = Form.create({ name: 'normal_newmenu' })(FormNewMenu);
    const WrappedNormalUpdateMenuForm = Form.create({ name: 'normal_updatemenu' })(FormUpdateMenu);

    const [isShowDrawerAdd, setIsShowDrawerAdd] = useState(false)
    const [isShowDrawerUpdate, setIsShowDrawerUpdate] = useState(false)
    const [rowElement, setrowElement] = useState({ firt: 1, last: rowData.length < 10 ? rowData.length : 10 })
    const [pageElement, setPageElement] = useState({ firt: 1, last: Math.ceil(rowData.length / 10) })

    const columnDefs = [
        { headerName: "STT", field: "id", checkboxSelection: true, maxWidth: 80, },
        { headerName: "Menu Name", field: "name", maxWidth: 300, },
        { headerName: "Shop ID", field: "shopId", maxWidth: 250,},
        { headerName: "Published", field: "isPublic",maxWidth: 80, },
        { headerName: "Active", field: "isActive", maxWidth: 80  },
        {
            headerName: 'Action',
            cellRenderer: 'Actions',
            cellRendererParams: {
                onEdit,
                onDelete,
                onViewListDish,
                publicMenu
            },
            filter: false,
        }
    ]
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

    

    function onDelete(_id) {
        props.DeleteMenu({
            variables: {
                id: _id
            },
            refetchQueries: () => {
                return [{ query: GET_ALL_MENUS,  variables: {siteId: props.currentSite}  }]
            },
            awaitRefetchQueries: true

        }).then(res => {
            if (res.data.deleteMenu) {
                NotiAnimation('sucess', 'delete menu success', 'Xóa menu thành công', 'red', 'bottomRight');
            }
        })
            .catch(err => {
                NotiAnimation('error', 'delete menu fail', err.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
            })
    }
    function onEdit(_id) {
        setIdEdit(_id)
        setIsShowDrawerUpdate(true)
    }

    function onViewListDish(_id) {
        history.push(`/menu/detail/${_id}`)

    }
    function publicMenu(_id) {
        props.PublishMenu({
            variables: {
                id: _id
            },
            refetchQueries: () => {
                return [{ query: GET_ALL_MENUS,  variables: {siteId: props.currentSite}  }]
            },
            awaitRefetchQueries: true

        }).then(res => {
            if (res.data.publishAndUnpublishMenu) {
                NotiAnimation('success', 'Public menu success', 'public menu thành công', 'green', 'bottomRight');
            }
        })
            .catch(err => {
                NotiAnimation('error', 'public menu fail', err.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
            })
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
        setIsShowDrawerAdd(false)
    }
    const onCloseDrawerUpdate = () => {
        setIsShowDrawerUpdate(false)
    }

    const onPageSizeChanged = (newPageSize) => {
        if(rowData.length !== 0) {
            gridApi.paginationSetPageSize(Number(newPageSize));
            const currentPageNumber = gridApi.paginationGetCurrentPage() + 1
            setrowElement({ firt: 1, last: rowData.length > newPageSize ? newPageSize : rowData.length })
            setPageElement({ firt: currentPageNumber, last: Math.ceil(rowData.length / newPageSize) })
        }
        
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

    return (
        <>
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
                <Tooltip placement="bottom" title="add new menu">
                    <button className="add" onClick={() => setIsShowDrawerAdd(true)} style={{ margin: '0 50px', border: 'none', background: 'none', cursor: 'pointer', float: 'right' }}>
                        <Icon type="plus" style={{ color: 'blue', fontSize: 20 }} />
                    </button>
                </Tooltip>
            </div>
            <Drawer
                title="New Menu"
                width={600}
                onClose={onCloseDrawer}
                closable={false}
                visible={isShowDrawerAdd}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <WrappedNormalNewMenuForm currentSite={props.currentSite} onCloseDrawer={onCloseDrawer} {...props} />
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
                    <Button form="formNewMenu" key="submit" htmlType="submit" type="primary"> Lưu </Button>
                </div>
            </Drawer>
            <Drawer
                title="Update Menu"
                width={600}
                onClose={onCloseDrawerUpdate}
                closable={false}
                visible={isShowDrawerUpdate}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <WrappedNormalUpdateMenuForm currentSite={props.currentSite} idEdit={idEdit} onCloseDrawerUpdate={onCloseDrawerUpdate} {...props} />
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
                    <Button form="formUpdateMenu" key="submit" htmlType="submit" type="primary"> Lưu </Button>
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
                />
            </div>
        </>
    )
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
const DELETE_MENU = gql`
  mutation deleteMenu($id: String!) {
    deleteMenu(id: $id)
  }
`

const PUBLISH_MENU = gql`
  mutation publishAndUnpublishMenu($id: String!){
    publishAndUnpublishMenu(id: $id)
  }
`

export default compose(
    graphql(DELETE_MENU, {
        name: 'DeleteMenu'
    }),
    graphql(PUBLISH_MENU, {
        name: 'PublishMenu'
    })
)(MenuAgGrid);