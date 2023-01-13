import { parse } from 'querystring';
import { Collections } from '../services/database.service.js';
import { ObjectId } from 'mongodb';
import * as url from 'url';
var PostRouter = {};
PostRouter["/all"] = (req, res) => {
    if (req.method !== 'GET') {
        const data = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: "GET"
        });
        res.writeHead(405, {
            "Content-Type": "application/json"
        });
        res.end(data);
    }
    else {
        const users = (Collections.User.find({})).toArray().then((result) => {
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify(result));
        }).catch((e) => {
            res.writeHead(500, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                msg: e.message
            }));
        });
    }
};
PostRouter["/get-1"] = (req, res) => {
    if (req.method !== 'GET') {
        const data = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: "GET"
        });
        res.writeHead(405, {
            "Content-Type": "application/json"
        });
        res.end(data);
    }
    else {
        const queryParams = parse(url.parse(req.url).query);
        if (!queryParams.id) {
            res.writeHead(403, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                msg: "id is required in url query"
            }));
        }
        else {
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            Collections.User.findOne({ _id: new ObjectId(queryParams.id) }).then((result) => {
                if (result) {
                    res.end(JSON.stringify(result));
                }
                else {
                    res.end(JSON.stringify({
                        msg: "no record found"
                    }));
                }
            }).catch((e) => {
                res.end(JSON.stringify({
                    msg: e.message
                }));
            });
        }
    }
};
PostRouter["/create"] = (req, res) => {
    if (req.method !== 'POST') {
        const data = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: "POST"
        });
        res.writeHead(405, {
            "Content-Type": "application/json"
        });
        res.end(data);
    }
    else {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const user = JSON.parse(body);
            if (!user.name) {
                res.writeHead(403, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    msg: "name is required"
                }));
            }
            else {
                Collections.User.insertOne({
                    name: user.name
                }).then((result) => {
                    res.writeHead(201, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        _id: result.insertedId,
                        name: user.name
                    }));
                }).catch((e) => {
                    res.writeHead(500, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        msg: e.message
                    }));
                });
            }
        });
    }
};
PostRouter["/update"] = (req, res) => {
    if (req.method !== 'PUT') {
        const data = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: "PUT"
        });
        res.writeHead(405, {
            "Content-Type": "application/json"
        });
        res.end(data);
    }
    else {
        const queryParams = parse(url.parse(req.url).query);
        if (!queryParams.id) {
            res.writeHead(403, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                msg: "id is required in url query"
            }));
        }
        else {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", () => {
                const user = JSON.parse(body);
                if (!user.name) {
                    res.writeHead(403, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        msg: "name is required"
                    }));
                }
                else {
                    const query = { _id: new ObjectId(queryParams.id) };
                    Collections.User.updateOne(query, {
                        $set: { name: user.name }
                    }).then((result) => {
                        res.writeHead(200, {
                            "Content-Type": "application/json"
                        });
                        res.end(JSON.stringify({
                            name: user.name,
                            id: queryParams.id
                        }));
                    }).catch((e) => {
                        res.writeHead(500, {
                            "Content-Type": "application/json"
                        });
                        res.end(JSON.stringify({
                            msg: e.message
                        }));
                    });
                }
            });
        }
    }
};
PostRouter["/delete"] = (req, res) => {
    if (req.method !== 'DELETE') {
        const data = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: 'DELETE'
        });
        res.writeHead(405, {
            "Content-Type": "application/json"
        });
        res.end(data);
    }
    else {
        const queryParams = parse(url.parse(req.url).query);
        if (!queryParams.id) {
            res.writeHead(403, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                msg: "id is required in url query"
            }));
        }
        else {
            const query = { _id: new ObjectId(queryParams.id) };
            Collections.User.deleteOne(query).then((result) => {
                if (result['deletedCount'] < 1) {
                    res.writeHead(403, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        id: queryParams.id,
                        msg: "record not found"
                    }));
                }
                else {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        id: queryParams.id,
                        msg: "record deleted"
                    }));
                }
            }).catch((e) => {
                const msg = JSON.stringify({
                    msg: e.message
                });
                res.writeHead(500, {
                    "Content-Type": "application/json"
                });
                res.end(msg);
            });
        }
    }
};
export default PostRouter;
//# sourceMappingURL=PostRouter.js.map