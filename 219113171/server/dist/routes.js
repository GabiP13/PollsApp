"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPolls = exports.load = exports.list = exports.update = exports.save = void 0;
var openPolls = new Map();
var closedPolls = new Map();
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
var save = function (req, res) {
    var e_1, _a;
    var name = req.body.name;
    var minutes = req.body.minutes;
    var options = req.body.options;
    if (typeof name != "string") {
        res.status(400).send("[save] name not string");
    }
    else if (typeof minutes !== "number") {
        res.status(400).send("[save] minutes not a number");
    }
    else if (!Array.isArray(options)) {
        res.status(400).send("[save] options not an array");
    }
    else {
        // files.set(name, req.body.value);
        if (openPolls.has(name))
            res.status(400).send("Poll with that name already exists");
        else {
            var m = new Map();
            try {
                for (var options_1 = __values(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
                    var option = options_1_1.value;
                    m.set(option, []);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var p = { endTime: Date.now() + minutes * 60000, optionsToVotes: m };
            openPolls.set(name, p);
            res.status(200).send({ added: true });
        }
        return;
    }
};
exports.save = save;
/**
 *
 * @param req: input request
 * @param res: response from server
 */
var update = function (req, res) {
    var e_2, _a;
    // for this poll, for every option, make sure [name] has not voted yet
    var names = req.body.name;
    var option = req.body.option;
    var voter = req.body.option;
    console.log("we are updating name [".concat(names, "] option [").concat(option, "] and voter [").concat(voter, "]"));
    if (typeof names !== "string") {
        res.status(400).send("[update] name was not a string");
    }
    else if (typeof option !== "string") {
        res.status(400).send("[update] option was not a string");
    }
    else if (typeof voter !== "string") {
        res.status(400).send("[update] voter was not a string");
    }
    else {
        var name_1 = names.trim();
        if (!openPolls.has(name_1)) {
            res.status(400).send("poll does not exist?");
            console.log("called");
        }
        else {
            var m = openPolls.get(name_1);
            if (m === undefined)
                res.status(400).send("no fields");
            else {
                var map = m.optionsToVotes;
                try {
                    // remove if voter has already voted somewhere else
                    for (var map_1 = __values(map), map_1_1 = map_1.next(); !map_1_1.done; map_1_1 = map_1.next()) {
                        var _b = __read(map_1_1.value, 2), optionMap = _b[0], votesArr = _b[1];
                        if (votesArr.includes(voter))
                            votesArr.splice(votesArr.indexOf(voter), votesArr.indexOf(voter));
                        // now add voter in correct place
                        if (optionMap === option)
                            votesArr.push(voter);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (map_1_1 && !map_1_1.done && (_a = map_1.return)) _a.call(map_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                res.status(200).send({ added: true });
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
};
exports.update = update;
/**
 *
 * @param req: input request
 * @param res: response from server
 */
var list = function (req, res) {
    var e_3, _a, e_4, _b;
    updatePolls();
    var type = req.query.type;
    if (type === "open") {
        if (openPolls.size === 0) {
            res.status(200).send("[list] No open polls in server");
        }
        else {
            var polls = [];
            try {
                for (var openPolls_1 = __values(openPolls), openPolls_1_1 = openPolls_1.next(); !openPolls_1_1.done; openPolls_1_1 = openPolls_1.next()) {
                    var _c = __read(openPolls_1_1.value, 2), name_2 = _c[0], poll = _c[1];
                    polls.push("".concat(name_2, " ~ ").concat((poll.endTime - Date.now()) / 60000, " minutes remaining"));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (openPolls_1_1 && !openPolls_1_1.done && (_a = openPolls_1.return)) _a.call(openPolls_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            res.status(200).send({ open: polls });
        }
        return;
    }
    else { // type = closed
        if (closedPolls.size === 0)
            res.status(200).send("[list] No closed polls in server");
        else {
            var polls = [];
            try {
                for (var closedPolls_1 = __values(closedPolls), closedPolls_1_1 = closedPolls_1.next(); !closedPolls_1_1.done; closedPolls_1_1 = closedPolls_1.next()) {
                    var _d = __read(closedPolls_1_1.value, 2), name_3 = _d[0], poll = _d[1];
                    polls.push("".concat(name_3, " ~ ended ").concat((Date.now() - poll.endTime) / 60000, " minutes ago"));
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (closedPolls_1_1 && !closedPolls_1_1.done && (_b = closedPolls_1.return)) _b.call(closedPolls_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            res.status(200).send({ closed: polls });
        }
        return;
    }
};
exports.list = list;
/**
 *
 * @param req: input request
 * @param res: response from server
 */
var load = function (req, res) {
    var e_5, _a;
    var query = req.query.name;
    if (typeof query !== "string") {
        res.status(400).send("[load] query was not a string");
        return;
    }
    var name = query.substring(6);
    var type = query.substring(0, 6).trim();
    if (type === "open") {
        if (openPolls.has(name)) {
            var poll = openPolls.get(name);
            if (poll === undefined) {
                res.status(400).send("unreachable: poll does not exist");
                return;
            }
            var options = [];
            try {
                for (var _b = __values(poll.optionsToVotes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), option = _d[0], votes = _d[1];
                    votes;
                    options.push(option);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
            // minutes: number, options: string[]
            res.status(200).send({ minutes: (poll.endTime - Date.now()) / 60000, options: options });
        }
        else
            res.status(400).send("[load] open poll with this name does not exist");
        return;
    }
    else { // closed
        // send back
        // minutes remaining
        // options array
        if (closedPolls.has(name)) {
            var poll = closedPolls.get(name);
            if (poll === undefined) {
                res.status(400).send("unreachable: poll does not exist 2");
                return;
            }
            res.status(200).send({ minutes: (Date.now() - poll.endTime) / 60000, options: poll.options });
        }
        else
            res.status(400).send("[load] closed poll with this name does not exist");
        return;
    }
};
exports.load = load;
var updatePolls = function () {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d;
    var now = Date.now();
    var toRemove = [];
    try {
        // check the time shit
        // check the OPEN POLLS specifically (only)
        // check which open polls (if any)
        for (var openPolls_2 = __values(openPolls), openPolls_2_1 = openPolls_2.next(); !openPolls_2_1.done; openPolls_2_1 = openPolls_2.next()) {
            var _e = __read(openPolls_2_1.value, 2), name_4 = _e[0], poll = _e[1];
            if (now > poll.endTime) {
                toRemove.push(name_4);
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (openPolls_2_1 && !openPolls_2_1.done && (_a = openPolls_2.return)) _a.call(openPolls_2);
        }
        finally { if (e_6) throw e_6.error; }
    }
    try {
        // move those open polls (if any)
        for (var toRemove_1 = __values(toRemove), toRemove_1_1 = toRemove_1.next(); !toRemove_1_1.done; toRemove_1_1 = toRemove_1.next()) {
            var pollName = toRemove_1_1.value;
            // add to closed
            var optionsVotes = new Map();
            var options = [];
            var m = openPolls.get(pollName);
            if (m === undefined)
                return;
            var total = 0;
            try {
                for (var _f = (e_8 = void 0, __values(m.optionsToVotes)), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 2), option = _h[0], votes = _h[1];
                    total += votes.length;
                    optionsVotes.set(option, votes.length);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                }
                finally { if (e_8) throw e_8.error; }
            }
            try {
                for (var optionsVotes_1 = (e_9 = void 0, __values(optionsVotes)), optionsVotes_1_1 = optionsVotes_1.next(); !optionsVotes_1_1.done; optionsVotes_1_1 = optionsVotes_1.next()) {
                    var _j = __read(optionsVotes_1_1.value, 2), option = _j[0], votesnum = _j[1];
                    // console.log(votesnum)
                    if (votesnum === 0)
                        options.push("0% of votes for " + option);
                    else
                        options.push(votesnum / total * 100 + "% of votes for " + option);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (optionsVotes_1_1 && !optionsVotes_1_1.done && (_d = optionsVotes_1.return)) _d.call(optionsVotes_1);
                }
                finally { if (e_9) throw e_9.error; }
            }
            var closed_1 = { endTime: m.endTime, options: options };
            closedPolls.set(pollName, closed_1);
            // remove from open
            if (openPolls.delete(pollName))
                console.log("deleted poll named ".concat(pollName));
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (toRemove_1_1 && !toRemove_1_1.done && (_b = toRemove_1.return)) _b.call(toRemove_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return;
};
/**
 * Clear everything stored in the server for testing
 */
var resetPolls = function () {
    openPolls.clear();
    closedPolls.clear();
};
exports.resetPolls = resetPolls;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQSxJQUFNLFNBQVMsR0FBMEIsSUFBSSxHQUFHLEVBQW9CLENBQUM7QUFPckUsSUFBTSxXQUFXLEdBQTRCLElBQUksR0FBRyxFQUFzQixDQUFDO0FBRzNFLCtCQUErQjtBQUUvQjs7Ozs7Ozs7SUFRSTtBQUdKOzs7O0dBSUc7QUFDSSxJQUFNLElBQUksR0FBRyxVQUFDLEdBQWdCLEVBQUUsR0FBaUI7O0lBRXRELElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzNCLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ2pDLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBRWpDLElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxFQUFFO1FBQzNCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUE7S0FDL0M7U0FBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUN0QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0tBQ3BEO1NBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDbEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtLQUNwRDtTQUFNO1FBQ0wsbUNBQW1DO1FBRW5DLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElB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