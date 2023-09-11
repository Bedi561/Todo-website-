"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = 'SECr3t';
exports.SECRET = SECRET;
// this request, resposne and next function wala sirf authenticate wale mei HI KRNA HAI BS ie the middleware ONLY
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, SECRET, (err, payload) => {
            if (err)
                throw err;
            if (!payload) {
                return res.sendStatus(403);
            }
            // all thses check are vvvimpp without this ts wont allow to do so 
            if (typeof payload === "string") {
                return res.sendStatus(403);
            }
            req.headers["userId"] = payload.id; // this is the change we made here cuz we only want that 1 specifc info to stored thruout the code
            // we just  made a change in the above line
            next();
        });
    }
    else {
        res.status(401);
    }
};
exports.authenticateJwt = authenticateJwt;
// A very major error userId wala --- the best way to fix it is
//  one way could be us making our own interface like
/*
interface updateRequest extends Request{
    userId: string;
} */
//  but will do like this
//  req.headers["userId"] = user.id
// but initially it will give error for the (user)--- thus instead of the user 
// we set it as payload as it could be anything not explicitally defined 
// could be a string, undefined 
// cuz we know ki headers can have keys and they can be a key
// If the JWT verification is successful but the payload is empty (indicating that the 
// token is not valid or expired), it responds with an HTTP status code 403 (Forbidden). This typically means that the user is not authenticated.
// If the payload is a string (which would be unexpected for a JWT), it also responds with an HTTP status code 403. This additional check helps ensure that the payload is not just a string.
//   req.headers["userId"] = payload.id;
// Assuming the JWT verification is successful and the payload contains an 'id' field, this line adds a 'userId' header to the req object, storing the 'id' value from the payload.
