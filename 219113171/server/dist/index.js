"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = require("./routes");
var body_parser_1 = __importDefault(require("body-parser"));
// Configure and start the HTTP server.
var port = 8088;
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
//app.get("/api/dummy", dummy);  // TODO: REMOVE
app.get("/api/list", routes_1.list);
app.post("/api/save", routes_1.save);
app.get("/api/load", routes_1.load);
app.post("/api/update", routes_1.update);
app.listen(port, function () { return console.log("Server listening on ".concat(port)); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBMkM7QUFDM0MsbUNBQW9EO0FBQ3BELDREQUFxQztBQUdyQyx1Q0FBdUM7QUFDdkMsSUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDO0FBQzFCLElBQU0sR0FBRyxHQUFZLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLGdEQUFnRDtBQUNoRCxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxhQUFJLENBQUMsQ0FBQTtBQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxhQUFJLENBQUMsQ0FBQTtBQUMzQixHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxhQUFJLENBQUMsQ0FBQTtBQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxlQUFNLENBQUMsQ0FBQTtBQUUvQixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBdUIsSUFBSSxDQUFFLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDIn0=