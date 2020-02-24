import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const Site = (props) => {
    const columnDefs = [
        { headerName: "STT", field: "id", checkboxSelection: true, width: 80 },
        { headerName:  "Site Name", field: "siteName", resizable: true, width: 500, minWidth:100,maxWidth:600 },
        { headerName: "Action", field: "action",  width: 700, minWidth:100}]
    const rowData = [
        { siteName: "Sài Gòn", action: "Xóa,Sửa"},
        { siteName: "Nha Trang", action: "Xóa,Sửa"},
        { siteName: "Đà Nẵng", action: "Xóa,Sửa"}]
       
    return (
        <div style={{backgroundColor: "#FFF", height:'100%'}}>
            <div className="title-header" style={{ backgroundColor: "#F7F7F8", width: '100vw', height: '40px', boxShadow:'0 4px 2px -2px #D4D4D4', padding:'10px 50px', fontWeight:'bold'}}> Manage Sites </div>
            <div className="ag-theme-balham" style={{ height: '500px', width: '93%' , margin: '40px 50px' }}>
                <AgGridReact 
                    columnDefs={columnDefs}
                    rowData={rowData}
                >
                </AgGridReact>
            </div>
        </div>
        )
}
            
export default Site