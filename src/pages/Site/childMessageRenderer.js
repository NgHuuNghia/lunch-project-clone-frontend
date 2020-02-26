import React, {Component} from "react";

export default class ChildMessageRenderer extends Component {
    constructor(props) {
        super(props);

        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }

    invokeParentMethod() {
        // console.log(`Row: ${this.props.node.rowIndex}, Col: ${this.props.colDef.headerName}`)
        this.props.context.actionMessage(`Row: ${this.props.node.rowIndex}, Col: ${this.props.colDef.headerName}`)
    }

    render() {
        return (
            <span><button style={{height: 20, lineHeight: 0.5}} onClick={this.invokeParentMethod} className="btn btn-info">Invoke Parent</button></span>
        );
    }
};