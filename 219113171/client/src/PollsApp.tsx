import React, { Component, MouseEvent } from "react";
import { isRecord } from './record';
import { NewEditor } from "./Editor";
import { ExistingEditor } from "./ExistingEditor";
import { ClosedEditor } from "./ClosedEditor";


// TODO: When you're ready to get started, you can remove all the code below and
// start with this blank application:

type PollsAppState = {
  pollList: boolean;
  error: string;
  pollsOpen: string[]
  pollsClosed: string[]
  editPoll: string[];
  options: [string, string[]];
  minutes: number;
  check: boolean;
}

/** Displays the UI of the Polls application. */
export class PollsApp extends Component<{}, PollsAppState> {

  constructor(props: {}) {
    super(props);

    
    this.state = {pollList: true, error: "", pollsOpen: [], pollsClosed: [], editPoll: [], options: ["", []], minutes: 0, check: false};
    this.doPollsFetch();
  }
  
  render = (): JSX.Element => {
    if (this.state.pollList) {
      // show all polls
      if (this.state.pollsOpen.length === 0 && this.state.pollsClosed.length === 0) {
        return <div><h2>Open polls:</h2><p>None right now!</p>
                    <h2>Closed polls:</h2><p>None right now!</p>
          <button style={{backgroundColor: "#4C2B84", color: "white"}} onClick={this.doPollMakeClick}>Make New Poll</button>
        </div>;
      } else if (this.state.pollsOpen.length === 0) {
        return <div><h2>Open polls:</h2><p>None right now!</p>
                    <h2>Closed polls:</h2><ul>{this.doPollsShowClosedClick(0)}</ul>
          <button style={{backgroundColor: "#4C2B84", color: "white"}} onClick={this.doPollMakeClick}>Make New Poll</button>
        </div>;
      } else if (this.state.pollsClosed.length === 0) {
        return <div><h2>Open polls:</h2><ul>{this.doPollsShowOpenClick(0)}</ul>
                    <h2>Closed polls:</h2><p>None right now!</p>
          <button style={{backgroundColor: "#4C2B84", color: "white"}} onClick={this.doPollMakeClick}>Make New Poll</button>
        </div>;
      } else {
        return <div><h2>Open polls:</h2><ul>{this.doPollsShowOpenClick(0)}</ul>
                    <h2>Closed polls:</h2><ul>{this.doPollsShowClosedClick(0)}</ul>
          <button style={{backgroundColor: "#4C2B84", color: "white"}} onClick={this.doPollMakeClick}>Make New Poll</button>
        </div>;
      }


    } else {
      // show editor, editPoll = open/closed/new, name of item
      if (this.state.editPoll[0] === "new") {
        // NEW idk no fetch here
        return <NewEditor onSaveClick={this.doSaveClick}/>
      } else if (this.state.editPoll[0] === "open") {
        // allow to edit + FETCH
        if (this.state.check) this.doOpenLoadClick();

        console.log(`minutes is ${this.state.minutes}`)
        return <ExistingEditor name={this.state.editPoll[1].substring(0, this.state.editPoll[1].indexOf("~") - 1)} 
                                minutes={this.state.minutes} 
                                options={this.state.options[1]}
                                onSaveClick={this.doSaveClick} onBackClick={this.doBackClick}/>
      } else {
        if (this.state.check) this.doClosedLoadClick();
        // clsoed DON'T allow edit + FETCH
        // for (let option of this.state.options[1]) console.log(`option in app: ${option}`)

        return <ClosedEditor name={this.state.editPoll[1]} minutes={this.state.minutes} 
                                options={this.state.options[1]} onBackClick={this.doBackClick}/>
      }
    }
    
    // list of polls
    // or editor w/ "new or bid" ?
  };

  doPollMakeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({pollList: false, editPoll: ["new"]})
  }

  doPollOpenClick = (ind: number): void => {
    this.setState({pollList: false, check: true, editPoll: ["open", this.state.pollsOpen[ind]]})
    
    //console.log(`non-stupid ${this.state.pollsOpen[ind]}`)
    //console.log(`editpoll stupid ass shit ${this.state.editPoll[1].substring(0, this.state.editPoll[1].indexOf("~") - 1)}`)
    fetch("/api/load" + "?name=" + encodeURIComponent("open  " + this.state.pollsOpen[ind].substring(0, this.state.pollsOpen[ind].indexOf("~") - 1)))
      .then(this.doOpen2LoadClick)
      .catch(() => this.doError("open load failed"))
  }

  doPollClosedClick = (ind: number): void => {
    this.setState({pollList: false, check: true, editPoll: ["closed", this.state.pollsClosed[ind]]})
  }

  doPollsShowOpenClick = (index: number): JSX.Element => {
    if (index === this.state.pollsOpen.length - 1) return <div><li><a href="#" onClick={() => this.doPollOpenClick(index)}>{this.state.pollsOpen[index]}</a></li></div>;
    else return <div><li><a href="#" onClick={() => this.doPollOpenClick(index)}>{this.state.pollsOpen[index]}</a></li>{this.doPollsShowOpenClick(index + 1)}</div>
  }

  doPollsShowClosedClick = (index: number): JSX.Element => {
    if (index === this.state.pollsClosed.length - 1) return <div><li><a href="#" onClick={() => this.doPollClosedClick(index)}>{this.state.pollsClosed[index]}</a></li></div>;
    else return <div><li><a href="#" onClick={() => this.doPollClosedClick(index)}>{this.state.pollsClosed[index]}</a></li>{this.doPollsShowClosedClick(index + 1)}</div>
  }

  doPollsFetch = (): void => {

    // console.log("we are in the fetch function in app")

    fetch("/api/list" + "?type=" + encodeURIComponent("open")).then(this.doOpenFetch)
      .catch(() => this.doError("open server 1"))

    fetch("/api/list" + "?type=closed").then(this.doClosedFetch)
      .catch(() => this.doError("closed server 1"))
  
  }

  doOpenFetch = (res: Response): void => { // list fetch
    if (res.status !== 200) this.doError("open status != 200")
    else res.json().then(this.doOpen2Fetch)
      .catch(() => this.doError("open server 2"))
  }

  doOpen2Fetch = (data: unknown): void => { // list fetch
    console.log("we are in the 2 fetch function in app")

    if (!isRecord(data)) this.doError("open not a record")
    else if (!Array.isArray(data.open)) {this.doError("open not an array")
        console.log(JSON.stringify(data.open))}
    else {this.setState({pollsOpen: data.open}); console.log("[APP] polls open update")}
  }

  doClosedFetch = (res: Response): void => {
    if (res.status !== 200) this.doError("closed status != 200")
    else res.json().then(this.doClosed2Fetch)
      .catch(() => this.doError("closed server 2"))
  }

  doClosed2Fetch = (data: unknown): void => {
    if (!isRecord(data)) this.doError("closed not a record")
    else if (!Array.isArray(data.closed)) this.doError("closed not an array")
    else {this.setState({pollsClosed: data.closed}); console.log("[APP] polls closed update")}
  }



  doSaveClick = (): void => {
    this.doPollsFetch();
    this.setState({pollList: true})
  }

  doBackClick = (): void => {
    this.doPollsFetch();
    this.setState({pollList: true, editPoll: []})
  }

  doError = (msg: string): void => {
    console.log(`type of error: ${msg}`)
  }


  doOpenLoadClick = (): void => {
    //
    console.log(`editpoll stupid ass shit ${this.state.editPoll[1].substring(0, this.state.editPoll[1].indexOf("~") - 1)}`)
    fetch("/api/load" + "?name=" + encodeURIComponent("open  " + this.state.editPoll[1].substring(0, this.state.editPoll[1].indexOf("~") - 1)))
      .then(this.doOpen2LoadClick)
      .catch(() => this.doError("open load failed"))
  }

  doOpen2LoadClick = (res: Response): void => {
    if (res.status !== 200) this.doError("load open status !== 200")
    else res.json().then(this.doOpen3LoadClick).catch(() => this.doError("open2 error"))
  }

  doOpen3LoadClick = (data: unknown): void => {
    if (!isRecord(data)) this.doError("not a record open3")
    else if (!Array.isArray(data.options)) this.doError("not an array open3")
    else if (typeof data.minutes !== "number" || isNaN(data.minutes)) this.doError("not a valid number open3")
    else {
      console.log(`data.mins = ${data.minutes}`)
      // if (!Array.isArray(data.options[1])) this.doError("not an array open3.2")
      this.setState({pollList: false, check: false, minutes: data.minutes, options: ["", data.options]});
      return;
      //


      /*const arr: string[] = this.state.editPoll; ///// sending back only options; will have to parse minutes in render idk
      arr.push(data.values); /////////////////////////////////////////////////// probably add in the options already loolllll
      this.setState({pollList: false, editPoll: arr})*/
    }
  }

  doClosedLoadClick = (): void => {

    console.log("boom pow the beat of my heart he beat idk")
    fetch("/api/load" + "?name=" + encodeURIComponent("closed" + this.state.editPoll[1].substring(0, this.state.editPoll[1].indexOf("~") - 1)))
      .then(this.doClosed2LoadClick)
      .catch(() => this.doError("closed load failed"))
  }

  doClosed2LoadClick = (res: Response): void => {

    if (res.status !== 200) this.doError("load closed status !== 200")
    else res.json().then(this.doClosed3LoadClick).catch(() => this.doError("closed2 error"))
  }

  doClosed3LoadClick = (data: unknown): void => {

    if (!isRecord(data)) this.doError("not a record closed3")
    else if (!Array.isArray(data.options)) this.doError("not an array closed3")
    //else if (typeof data.minutes !== "number") this.doError("not a number closed3")
    else {
      this.setState({pollList: false, check: false, minutes: Number(data.minutes), options: ["", data.options]})
      return;
    }
  }
}




/*
type PollsAppState = {
  name: string;  // mirror state of name input box
  msg: string;   // essage sent from server
}


/** Displays the UI of the Polls application. *
export class PollsApp extends Component<{}, PollsAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {name: "", msg: ""};
  }
  
  render = (): JSX.Element => {
    return (<div>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={this.state.name}
                 onChange={this.doNameChange}></input>
          <button onClick={this.doDummyClick}>Dummy</button>
        </div>
        {this.renderMessage()}
      </div>);
  };

  renderMessage = (): JSX.Element => {
    if (this.state.msg === "") {
      return <div></div>;
    } else {
      return <p>Server says: {this.state.msg}</p>;
    }
  };

  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: evt.target.value, msg: ""});
  };

  doDummyClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const name = this.state.name.trim();
    if (name.length > 0) {
      const url = "/api/dummy?name=" + encodeURIComponent(name);
      fetch(url).then(this.doDummyResp)
          .catch(() => this.doDummyError("failed to connect to server"));
    }
  };

  doDummyResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doDummyJson)
          .catch(() => this.doDummyError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doDummyError)
          .catch(() => this.doDummyError("400 response is not text"));
    } else {
      this.doDummyError(`bad stauts code ${res.status}`);
    }
  };

  doDummyJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("200 response is not a record", data);
      return;
    }

    if (typeof data.msg !== "string") {
      console.error("'msg' field of 200 response is not a string", data.msg);
      return;
    }

    this.setState({msg: data.msg});
  }

  doDummyError = (msg: string): void => {
    console.error(`Error fetching /api/dummy: ${msg}`);
  };

}*/