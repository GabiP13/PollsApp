import React, { Component } from "react";
//import { isRecord } from './record';

type ClosedEditorProps = {
    /** Initial state of the file. */
    name: string;
    minutes: number; // has to be an int > 0
    options: string[];
    onBackClick: () => void;
};

type ClosedEditorState = {
}

export class ClosedEditor extends Component<ClosedEditorProps, ClosedEditorState> {

    constructor(props: ClosedEditorProps) {
      super(props);
  
      this.state = {error: "", option: this.props.options[0], voter: ""};
    }
    
    render = (): JSX.Element => {
        const options: JSX.Element[] = [];

        for (let option of this.props.options) {
            options.push(
                <li>
                    {option}
                </li>
            )
        }

        return <div>
            <h2>{this.props.name}</h2>
            <ul>{options}</ul>
            <button onClick={this.props.onBackClick}>Back to List</button>
        </div>
    }
}