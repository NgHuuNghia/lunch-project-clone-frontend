import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const Site = (props) => {
    const columnDefs = [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" }]
    const rowData = [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }]
    return (
        <div className="ag-theme-balham" style={{ height: '200px', width: '600px' }}>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}>
            </AgGridReact>
        </div>
    )
}

export default Site