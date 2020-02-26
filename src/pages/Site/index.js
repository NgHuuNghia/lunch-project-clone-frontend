import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import ChildMessageRenderer from "./childMessageRenderer.js";
import './index.css'
import { Select, Icon } from 'antd';
const { Option } = Select;

const Site = (props) => {
    const [gridApi, setGridApi] = useState()
    const columnDefs = [
        { headerName: "STT", field: "id", checkboxSelection: true, maxWidth: 80,  },
        { headerName: "Site Name", field: "siteName" },
        { 
            headerName: "Action",
            cellRenderer: "childMessageRenderer",
         
        }
        ]
    const rowData = [
        { siteName: "Sài Gòn"},
        { siteName: "Nha Trang" },
        { siteName: "Đà Nẵng" },
    ]
    const [rowElement,setrowElement] = useState({firt:1,last: rowData.length < 10 ? rowData.length : 10})
    const [pageElement,setPageElement] = useState({firt:1,last:Math.ceil(rowData.length/10)})

    const getRowHeight = (params) => {
        if (params.node.level === 0) {
            return 40;
        } else {
            return 25;
        }
    }
    const onFirstDataRendered = (params) => {
        const { api } = params;
        setGridApi(api);
        params.api.sizeColumnsToFit()
    }
    const onPageSizeChanged= (newPageSize) => {
        gridApi.paginationSetPageSize(Number(newPageSize));
        const currentPageNumber = gridApi.paginationGetCurrentPage() + 1
        setrowElement({firt:1,last:rowData.length > newPageSize ? newPageSize : rowData.length})
        setPageElement({firt: currentPageNumber,last:Math.ceil(rowData.length/newPageSize)})
    }
    const previousPage = () => {
        const previousPageNumber = gridApi.paginationGetCurrentPage()
        gridApi.paginationGoToPreviousPage()
        const firtRowElement = gridApi.paginationGetPageSize()*gridApi.paginationGetCurrentPage() + 1
        const lastRowElement = gridApi.paginationGetPageSize()*gridApi.paginationGetCurrentPage() + gridApi.paginationGetPageSize() < gridApi.paginationGetRowCount() ? gridApi.paginationGetPageSize()*gridApi.paginationGetCurrentPage() + gridApi.paginationGetPageSize() : gridApi.paginationGetRowCount()
        if(previousPageNumber > 0){
            setPageElement({firt: previousPageNumber,last:pageElement.last})
            setrowElement({firt:firtRowElement,last:lastRowElement})
        }
    }
    const nextPage = () => {
        gridApi.paginationGoToNextPage()
        const nextPageNumber = gridApi.paginationGetCurrentPage() + 1
        const firtRowElement = gridApi.paginationGetPageSize()*gridApi.paginationGetCurrentPage() + 1
        const lastRowElement = gridApi.paginationGetPageSize()*gridApi.paginationGetCurrentPage() + gridApi.paginationGetPageSize() < gridApi.paginationGetRowCount() ? gridApi.paginationGetPageSize()*gridApi.paginationGetCurrentPage() + gridApi.paginationGetPageSize() : gridApi.paginationGetRowCount()
        setPageElement({firt: nextPageNumber,last:pageElement.last})
        setrowElement({firt:firtRowElement,last:lastRowElement})
    }
    function methodFromParent(cell) {
        alert("Parent Component Method from " + cell + "!");
    }
    return (
        <div style={{ backgroundColor: "#FFF", height: '100%' }}>
            <div className="title-header" style={{ backgroundColor: "#F7F7F8", width: '100vw', height: '40px', boxShadow: '0 4px 2px -2px #D4D4D4', padding: '10px 50px', fontWeight: 'bold' }}> Manage Sites </div>
            <div className="pagination-manage" style={{ marginTop: 10, marginLeft: 55, fontSize: 13 }}>
                <span className="selection-status"><strong>Total {rowData.length}</strong> </span>
                <span className="pagination-status">from {rowElement.firt} to {rowElement.last} </span>
                <Select defaultValue="10" id='selectSizePage' style={{  margin:'0 7px', width:60}} onChange={ onPageSizeChanged.bind(this)}>
                    <Option value="10">10</Option>
                    <Option value="25">25</Option>
                    <Option value="50">50</Option>
                </Select>
                <span className="pagination-status">rows per page</span>
                <button  onClick={ previousPage } style={{ margin: '0 7px', border: 'none', background:'none', cursor:'pointer'}}>
                    <Icon  style={{color: pageElement.firt === 1 ? '#d9d9d9' : 'black'}} type="left" />
                </button>
                <span className="pagination-page">page {pageElement.firt} of {pageElement.last}</span>
                <button onClick={ nextPage } style={{ margin: '0 7px', border: 'none', background:'none', cursor:'pointer'}}>
                <Icon  style={{color: pageElement.firt === pageElement.last ? '#d9d9d9' : 'black'}} type="right" />
                </button>
            </div>
            <div className="ag-theme-balham" style={{ height: '500px', width: '93%', margin: '10px 50px' }}>
                <AgGridReact
                    modules={AllCommunityModules}
                    frameworkComponents={{childMessageRenderer: ChildMessageRenderer}}
                    context={{ actionMessage: methodFromParent }}
                    style={{ borderRight: '1px solid #bdc3c7' }}
                    columnDefs={columnDefs}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        cellStyle: { borderRight: '1px solid #bdc3c7' }
                    }}
                    headerHeight={40}
                    rowData={rowData}
                    onFirstDataRendered={onFirstDataRendered.bind(this)}
                    pagination={true}
                    suppressPaginationPanel={true}
                    paginationPageSize={10}
                    getRowHeight={getRowHeight}
                >
                </AgGridReact>
            </div>
        </div>
    )
    
}


export default Site