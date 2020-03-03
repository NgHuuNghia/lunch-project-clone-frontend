import React, { useState, useEffect } from 'react'
import { Select, Icon,   } from 'antd';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Actions from './orderActions/index'
import NotiAnimation from "../../../components/shared/NotiAnimation";
const { Option } = Select;

const OrderAgGrid = (props) => {
    const [rowData, setRowData] = useState(props.rowData)
    const [gridApi, setGridApi] = useState()

    useEffect(() => {
        setRowData(props.rowData)
    }, [props.rowData])
    useEffect(() => {
        setrowElement({ firt: rowData.length === 0 ? 0 : 1, last: rowData.length < 10 ? rowData.length : 10 })
        setPageElement({ firt: 1, last: rowData.length !== 0 ? Math.ceil(rowData.length / 10) : 1 })
    }, [rowData])


    const [rowElement, setrowElement] = useState({ firt: 1, last: rowData.length < 10 ? rowData.length : 10 })
    const [pageElement, setPageElement] = useState({ firt: 1, last: Math.ceil(rowData.length / 10) })

    const columnDefs = [
        { headerName: "STT", field: "id", checkboxSelection: true, maxWidth: 80, },
        { headerName: "DishMenu Name", field: "name", },
        { headerName: "count", field: 'count', },
        { headerName: "orderCount", field: 'orderCount', },
        {
            headerName: 'Action',
            cellRenderer: 'Actions',
            cellRendererParams: {
                onDelete
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
        props.DeleteDishMenu({
            variables: {
                _id
            },
            refetchQueries: () => {
                return [{ query: GET_ALL_DISH_MENUS_PUBLISH}]
            },
            awaitRefetchQueries: true

        }).then(res => {
            if (res.data.deleteDishMenu) {
                NotiAnimation('error', 'delete dishMenu fail', 'Xóa dishMenu thành công', 'red', 'bottomRight');
            }
        })
            .catch(err => {
                NotiAnimation('error', 'delete dishMenu fail', err.graphQLErrors.map(x => x.message)[0], 'red', 'bottomRight');
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

    const onPageSizeChanged = (newPageSize) => {
        if (rowData.length !== 0) {
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

            </div>


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

const DELETE_DISH_MENU = gql`
  mutation deleteDishMenu($_id: String!) {
    deleteDishMenu(_id: $_id)
  }
`

export default graphql(DELETE_DISH_MENU, {
    name: 'DeleteDishMenu'
})(OrderAgGrid);