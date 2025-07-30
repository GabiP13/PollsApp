import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


type OpenPoll = {
  endTime: number;
  optionsToVotes: Map<string, string[]>
}

const openPolls: Map<string, OpenPoll> = new Map<string, OpenPoll>();

type ClosedPoll = {
  endTime: number;
  options: string[];
}

const closedPolls: Map<string, ClosedPoll> = new Map<string, ClosedPoll>();


// TODO: remove the dummy route

/*export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.query.name;
  if (typeof name !== 'string' || name.length === 0) {
    res.status(400).send('missing or invalid "name" parameter');
    return;
  }

  res.send({msg: `Hi, ${name}!`});
};*/


/**
 * 
 * @param req: input request 
 * @param res: response from server
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  
  const name = req.body.name;
  const minutes = req.body.minutes;
  const options = req.body.options;

  if (typeof name != "string") {
    res.status(400).send("[save] name not string")
  } else if (typeof minutes !== "number") {
    res.status(400).send("[save] minutes not a number")
  } else if (!Array.isArray(options)) {
    res.status(400).send("[save] options not an array")
  } else {
    // files.set(name, req.body.value);

    if (openPolls.has(name)) res.status(400).send("Poll with that name already exists")
    else {
      const m: Map<string, string[]> = new Map<string, string[]>();
      for (let option of options) {
        m.set(option, []);
      }
      const p: OpenPoll = {endTime: Date.now() + minutes * 60000, optionsToVotes: m}
      openPolls.set(name, p)

      res.status(200).send({added: true})
    }
    return;
  }
}

/**
 * 
 * @param req: input request 
 * @param res: response from server
 */
export const update = (req: SafeRequest, res: SafeResponse): void => {
  // for this poll, for every option, make sure [name] has not voted yet
  const names = req.body.name;
  const option = req.body.option;
  const voter = req.body.option;
  
  console.log(`we are updating name [${names}] option [${option}] and voter [${voter}]`)

  if (typeof names !== "string") {
    res.status(400).send("[update] name was not a string")
  } else if (typeof option !== "string") {
    res.status(400).send("[update] option was not a string")
  } else if (typeof voter !== "string") {
    res.status(400).send("[update] voter was not a string")
  } else {
    const name = names.trim();

    if (!openPolls.has(name)) {res.status(400).send("poll does not exist?"); console.log("called")}
    else {

      const m = openPolls.get(name);
      if (m === undefined) res.status(400).send("no fields")
      else {
        const map = m.optionsToVotes;
        
        // remove if voter has already voted somewhere else
        for (let [optionMap, votesArr] of map) {
          if (votesArr.includes(voter)) votesArr.splice(votesArr.indexOf(voter), votesArr.indexOf(voter));
          // now add voter in correct place
          if (optionMap === option) votesArr.push(voter);
        }

        res.status(200).send({added: true});
      }
    }

    return;
    /*const m = openVotes.get(name);
    if (m === undefined) {res.status(400).send("[update] something went wrong"); return;}

    for (let [key, value] of m) {
      key;
      if (value.includes(voter)) value.splice(value.indexOf(voter), value.indexOf(voter));
    }

    m.get(option)?.push(voter);
    res.status(200).send({added: true})*/
  }
}

/**
 * 
 * @param req: input request 
 * @param res: response from server
 */
export const list = (req: SafeRequest, res: SafeResponse): void => {

  updatePolls();

  const type = req.query.type;

  if (type === "open") {

    if (openPolls.size === 0) {res.status(200).send("[list] No open polls in server")}
    else {
      const polls: string[] = [];

      for (let [name, poll] of openPolls) {
        polls.push(`${name} ~ ${(poll.endTime - Date.now()) / 60000} minutes remaining`)
      }

      res.status(200).send({open: polls});
    }

    return;
  } else { // type = closed

    if (closedPolls.size === 0) res.status(200).send("[list] No closed polls in server")
    else {
      const polls: string[] = [];

      for (let [name, poll] of closedPolls) {
        polls.push(`${name} ~ ended ${(Date.now() - poll.endTime) / 60000} minutes ago`)
      }

      res.status(200).send({closed: polls});
    }

    return;
  }
}


/**
 * 
 * @param req: input request 
 * @param res: response from server
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {

  const query = req.query.name;
  
  if (typeof query !== "string") {res.status(400).send("[load] query was not a string"); return;}
  
  const name = query.substring(6);
  const type = query.substring(0, 6).trim();


  if (type === "open") {

    if (openPolls.has(name)) {

      const poll = openPolls.get(name);
      if (poll === undefined) {res.status(400).send("unreachable: poll does not exist"); return;}

      const options: string[] = [];
      for (let [option, votes] of poll.optionsToVotes) {
        votes;
        options.push(option);
      }

      // minutes: number, options: string[]
      res.status(200).send({minutes: (poll.endTime - Date.now()) / 60000, options: options})

    } else res.status(400).send("[load] open poll with this name does not exist")

    return;
  } else { // closed

    // send back
      // minutes remaining
      // options array


    if (closedPolls.has(name)) {

      const poll = closedPolls.get(name);
      if (poll === undefined) {res.status(400).send("unreachable: poll does not exist 2"); return;}
      
      res.status(200).send({minutes: (Date.now() - poll.endTime) / 60000, options: poll.options})

    } else res.status(400).send("[load] closed poll with this name does not exist")

    return;
  }
  
}


const updatePolls = (): void => {

  const now = Date.now();
  const toRemove: string[] = [];


  // check the time shit
  // check the OPEN POLLS specifically (only)


  // check which open polls (if any)
  for (let [name, poll] of openPolls) {
    if (now > poll.endTime) {toRemove.push(name);}
  }


  // move those open polls (if any)
  for (let pollName of toRemove) {
    // add to closed
    const optionsVotes: Map<string, number> = new Map<string, number>();
    const options: string[] = [];

    const m = openPolls.get(pollName);
    if (m === undefined) return;

    let total: number = 0;
    for (let [option, votes] of m.optionsToVotes) {
      total += votes.length;
      optionsVotes.set(option, votes.length);
    }

    for (let [option, votesnum] of optionsVotes) {
      // console.log(votesnum)
      if (votesnum === 0) options.push("0% of votes for " + option)
      else options.push(votesnum/total * 100 + "% of votes for " + option)
    }

    const closed: ClosedPoll = {endTime: m.endTime, options: options}
    closedPolls.set(pollName, closed);

    // remove from open
    if (openPolls.delete(pollName)) console.log(`deleted poll named ${pollName}`)
  }

  return;
} 

/**
 * Clear everything stored in the server for testing
 */
export const resetPolls = (): void => {
  openPolls.clear();
  closedPolls.clear();
}