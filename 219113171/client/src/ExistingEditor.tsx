import React, { Component, ChangeEvent } from "react";
import { isRecord } from './record';

type ExistingEditorProps = {
    /** Initial state of the file. */
    name: string;
    minutes: number; // has to be an int > 0
    options: string[];
    onSaveClick: () => void;
    onBackClick: () => void;
};

type ExistingEditorState = {
    error: string;
    option: string;
    voter: string
    minutes: number;
}

export class ExistingEditor extends Component<ExistingEditorProps, ExistingEditorState> {

    constructor(props: ExistingEditorProps) {
      super(props);

      const n: number = this.props.minutes;
      console.log(`n ${n}`)
  
      this.state = {error: "", option: this.props.options[0], voter: "", minutes: n};
    }
    
    render = (): JSX.Element => { // {this.doOpenOptionsClick(0)}
        
        const options: JSX.Element[] = [];

        // console.log("length " + this.props.options.length)

        for (const [index, option] of this.props.options.entries()) {
            options.push(

                <div key={index.toString()}>
                    <input type="radio" id={option} name="option" value={option}
                        onChange={this.doInputClick}/>
                    <label htmlFor={"option"}>{option}</label>
                </div>
            )
        }


        return <div>
            <h2>Showing Poll: "{this.props.name}"</h2>
            <p>{this.state.minutes} minute(s) remaining...</p>
            <ul>{options}</ul>
            <label>Your name: <input type="text" value={this.state.voter} onChange={this.doVoterChange}></input></label>
            <button onClick={this.doSaveClick}>Vote on Poll</button>
            <button onClick={this.doRefreshClick}>Refresh</button>
            <button onClick={this.doBackClick}>Back</button>
            <p>{this.state.error}</p>
        </div>

            const n: number = this.props.options.length;
            console.log("n: " + n); // <div>{this.doOpenOptionsClick(this.props.options.length - 1)}</div>
            for (let s of this.props.options) {console.log("this " + s);}
            return <div><h2>{this.props.name}</h2>
                    <p>youremoom {this.props.name} {this.props.options.length}</p>
                    <select value={this.state.option} onChange={this.doSelectClick}>
                        <option value="sa">sa</option>
                        <option value="su">su</option>
                    </select>
                    <label>Your name: <input type="text" value={this.state.voter} onChange={this.doVoterChange}></input></label>
                    <button onClick={this.doSaveClick}>Vote on Poll</button>
                    <button onClick={this.doBackClick}>Back</button>
                    <p>{this.state.error}</p>
                    </div>;
    }

    doRefreshClick = (): void => {
    
        fetch("/api/list" + "?type=" + encodeURIComponent("open")).then(this.doRefreshFetch)
          .catch(() => console.log("error connecting to server in open editor"))
      
    }
    
    doRefreshFetch = (res: Response): void => { // list fetch
        if (res.status !== 200) console.log("error connecting to server != 200")
        else res.json().then(this.doRefresh2Fetch)
          .catch(() => console.log("error connecting to server in open editor 2"))
    }
    
    doRefresh2Fetch = (data: unknown): void => { // list fetch
        console.log("we are in the 2 fetch function in app")
    
        if (!isRecord(data)) console.log("open editor not a record")
        else if (!Array.isArray(data.open)) {console.log("open editor not an array")
            console.log(JSON.stringify(data.open))}
        else {
            // check if poll is still open
            for (let poll of data.open) {
                if (poll.substring(0, poll.indexOf("~") - 1) === this.props.name) {
                    this.setState({minutes: Number(poll.substring(poll.indexOf("~") + 2, poll.indexOf("minutes") - 1))})
                    return;
                }
            }
            // poll is not still open if exited loop
            alert("This poll has closed, sorry!")
            this.props.onBackClick();
        }
    }
      

    doInputClick = (evt: ChangeEvent<HTMLInputElement>): void => {
        console.log(`you have chosen option ${evt.target.value}`)
        this.setState({option: evt.target.value, error: ""})
    }

    doVoterChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({voter: evt.target.value, error: ""})    
    }

    doOpenOptionsClick = (index: number): JSX.Element => {
        console.log("hereeee" + index);
        if (index === -1) {console.log("wrong tf"); return <li>you're a mistake</li>}
        else if (index === 0) {console.log("path 1"); return <input type="radio" >{this.props.options[index]}{index}</input>} // this.props.options.length - 1
        // why is it RE-RENDERING??
        //else if (index === 1) {console.log("1here"); return <div>1</div>;} // onClick={() => this.doSelectClick(index)} // 
        else {console.log("path 2"); return <div><input type="radio">{this.props.options[index]}{index}</input>{this.doOpenOptionsClick(index - 1)}</div>;}
    }

    doSelectClick = (_evt: ChangeEvent<HTMLSelectElement>): void => {
        this.setState({option: _evt.target.value, error: ""})
    }

    /*doClosedOptionsClick = (index: number): JSX.Element => {
        console.log("hereeee" + index);
        if (index === -1) {console.log("wrong tf"); return <li>you're a mistake</li>}
        else if (index === 0) {console.log("path 1"); return <li>{this.props.options[index]}{index}</li>} // this.props.options.length - 1
        // why is it RE-RENDERING??
        //else if (index === 1) {console.log("1here"); return <div>1</div>;}
        else {console.log("path 2"); return <div><li>{this.props.options[index]}{index}</li>{this.doOpenOptionsClick(index - 1)}</div>;}
    }*/

    doSaveClick = (): void => {
        //
        if (this.state.voter === "") this.setState({error: "Please input a name!"})
        else fetch("/api/update", {method: 'POST', body: JSON.stringify({name: this.props.name, option: this.state.option, voter: this.state.voter}), 
                                    headers: {"Content-Type": "application/json"}})
                .then(this.doSave2Click).catch(() => console.log("something went WRONG"))
    }

    doSave2Click = (res: Response): void => {
        //
        if (res.status !== 200) this.setState({error: "Your vote was not updated"})
        else this.setState({error: "Your vote has been saved!"});//res.json().then(this.doSave3Click).catch(() => console.log("something went WRONG2"))
    }

    doSave3Click = (data: unknown): void => {
        if (!isRecord(data)) this.setState({error: "something went wrong"})
        else this.setState({error: "Your vote has been saved!"})
    }

    doBackClick = (): void => {
        this.props.onSaveClick();
    }
}