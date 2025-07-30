import React, { Component, ChangeEvent } from "react";
//import { isRecord } from './record';


type NewEditorProps = {
    /** Initial state of the file. */
    onSaveClick: () => void;
};

type NewEditorState = {
    name: string;
    minutes: number; // has to be an int > 0
    options: string[];
    optionsstr: string;
    error: string;
}

/** Displays the UI of the Polls application. */
export class NewEditor extends Component<NewEditorProps, NewEditorState> {

    constructor(props: NewEditorProps) {
      super(props);
  
      this.state = {name: "", minutes: 1, error: "Enter options as a comma-separated list", options: [], optionsstr: ""};
    }
    
    render = (): JSX.Element => {
        //if (this.props.type === "new") {
            //return <div><p>hi it's me ne2w</p></div>;

            return <div>
                <label>Name: <input type="text" value={this.state.name} onChange={this.doNameChange}></input></label>
                <br/><p></p>
                <label>Minutes: <input type="number" min="1" step="1" value={this.state.minutes} onChange={this.doMinChange}></input></label>
                <br/><p></p>
                <label>Options: <input type="text" value={this.state.optionsstr} onChange={this.doOptionsChange}></input></label>
                <br/><p></p>
                <button onClick={this.doSaveClick}>Save Poll</button>
                <br/><p></p>
                <p style={{color: "red"}}>{this.state.error}</p>
            </div>

    }

    doError = (msg: string): void => {
        console.log(`editor error is: ${msg}`)
    }

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        if (evt.target.value.indexOf("~") !== -1) this.setState({name: evt.target.value.substring(0, evt.target.value.indexOf("~")), 
            error: "Name cannot contain character: ~"})
        else this.setState({name: evt.target.value, error: ""})
    }

    doMinChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        const n = Number(evt.target.value);
        //if (typeof n !== "number") this.setState({error: "Minutes must be an integer"}) 
        if (n === 0) this.setState({error: ""})
        else if (Math.floor(n) !== n) this.setState({error: "Minutes must be an integer"}) // greater than 0
        else this.setState({error: "", minutes: n})
    }

    doOptionsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({optionsstr: evt.target.value})
    }

    doSaveClick = (): void => {
        if (this.state.minutes === 0) this.setState({error: "Cannot save poll with invalid minutes input"})
        else {
            // options check
            let str = this.state.optionsstr;
            const arr: string[] = [];
            if (str.indexOf(",") === -1) {this.setState({error: "Enter options as a comma-separated list"}); return;}
            else {
                // Inv: 
                while (str.indexOf(",") !== -1) {
                    if (str.indexOf(",") !== 0) arr.push(str.substring(0, str.indexOf(",")));
                    str = str.substring(str.indexOf(",") + 1)
                }
                arr.push(str);
            }

            if (arr.length < 2) {this.setState({error: "Must have more than one option listed"}); return;}
            else {
                // console.log(`new editor name: ${this.state.name} and minutes ${this.state.minutes}`)
                fetch("/api/save", {method: 'POST', body: JSON.stringify({name: this.state.name, minutes: this.state.minutes, options: arr}), 
                headers: {"Content-Type": "application/json"}})
                    .then(this.doSaveCheckClick)
                    .catch(() => this.doError("not saved"))
                // check also if name == name of already existing poll
                // return to app
                this.setState({options: arr})
            }
        }
    }

    doSaveCheckClick = (res: Response): void => {
        if (res.status !== 200) {res.text().then(this.doClick).catch(() => this.doError("bad")); return;}
        else {
            //
            console.log(res.status + " save check");
            this.props.onSaveClick();
            // callback
            //this.props.onSaveClick(); // [this.props.type, this.state.name, String(this.state.minutes)]
        }
    }

    doClick = (data: unknown): void => {
        this.setState({error: String(data)})
        // this.doError(String(data));
    }
}