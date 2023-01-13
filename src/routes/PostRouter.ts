import {IncomingMessage, ServerResponse} from 'http';
import { parse } from 'querystring';
import { Collections } from '../services/database.service.js';
import { ObjectId } from 'mongodb'
import * as url from 'url';
import User from '../models/User.js';

var PostRouter : object = {}

PostRouter["/all"] = (req : IncomingMessage, res : ServerResponse) : void => {
    if(req.method !== 'GET') {
        const data : string = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: "GET"
        })
        res.writeHead(405, {
            "Content-Type": "application/json"
        })
        res.end(data);
    } else {
        const users = (Collections.User.find({})).toArray().then((result) : void => {
            res.writeHead(200, {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify(result))
        }).catch((e : Error) : void => {
            res.writeHead(500, {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify({
                msg: e.message
            }))
        });
    }
}

PostRouter["/get-1"] = (req : IncomingMessage, res : ServerResponse) : void => {
    if(req.method !== 'GET') {
        const data : string = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: "GET"
        })
        res.writeHead(405, {
            "Content-Type": "application/json"
        })
        res.end(data);
    } else {
        const queryParams = parse(url.parse(req.url).query);
        if(!queryParams.id) {
            res.writeHead(403, {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify({
                msg: "id is required in url query"
            }));   
        } else {
            res.writeHead(200, {
                "Content-Type": "application/json"
            })
            Collections.User.findOne({ _id: new ObjectId(queryParams.id as string) }).then((result) : void => {
                if(result) {
                    res.end(JSON.stringify(result));
                } else {
                    res.end(JSON.stringify({
                        msg: "no record found"
                    }));
                }
            }).catch((e: Error) => {
                res.end(JSON.stringify({
                    msg: e.message
                }))
            })
        }
    }
}

PostRouter["/create"] = (req : IncomingMessage, res : ServerResponse) : void => {
    if(req.method !== 'POST') {
        const data : string = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: "POST"
        })
        res.writeHead(405, {
            "Content-Type": "application/json"
        })
        res.end(data);
    } else {
        let body: string = "";
        req.on("data", (chunk: string) : void => {
            body += chunk;
        })
        req.on("end", () : void => {
            const user = JSON.parse(body);

            if(!user.name) {
                res.writeHead(403, {
                    "Content-Type": "application/json"
                })
                res.end(JSON.stringify({
                    msg: "name is required"
                }));    
            } else {
                Collections.User.insertOne({
                    name: user.name
                }).then((result) : void => {
                    res.writeHead(201, {
                        "Content-Type": "application/json"
                    })
                    res.end(JSON.stringify({
                        _id: result.insertedId,
                        name: user.name
                    }));
                }).catch((e: Error) : void => {
                    res.writeHead(500, {
                        "Content-Type": "application/json"
                    })
                    res.end(JSON.stringify({
                        msg: e.message
                    }));
                })
            }
        })
    }
}

PostRouter["/update"] = (req : IncomingMessage, res : ServerResponse) : void => {
    if(req.method !== 'PUT') {
        const data : string = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: "PUT"
        })
        res.writeHead(405, {
            "Content-Type": "application/json"
        })
        res.end(data);
    } else {
        const queryParams = parse(url.parse(req.url).query);
        if(!queryParams.id) {
            res.writeHead(403, {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify({
                msg: "id is required in url query"
            }));
        } else {
            let body: string = "";
            req.on("data", (chunk: string) : void => {
                body += chunk;
            })
            req.on("end", () : void => {
                const user = JSON.parse(body);
    
                if(!user.name) {
                    res.writeHead(403, {
                        "Content-Type": "application/json"
                    })
                    res.end(JSON.stringify({
                        msg: "name is required"
                    }));    
                } else {
                    const query = { _id: new ObjectId(queryParams.id as string) };
                    Collections.User.updateOne(query, {
                        $set: {name: user.name} as User
                    }).then((result) : void => {
                        res.writeHead(200, {
                            "Content-Type": "application/json"
                        })
                        res.end(JSON.stringify({
                            name: user.name,
                            id: queryParams.id as string
                        }));
                    }).catch((e: Error) : void => {
                        res.writeHead(500, {
                            "Content-Type": "application/json"
                        })
                        res.end(JSON.stringify({
                            msg: e.message
                        }));
                    })
                }
            })
        }
    }
}

PostRouter["/delete"] = (req : IncomingMessage, res : ServerResponse) : void => {
    if(req.method !== 'DELETE') {
        const data : string = JSON.stringify({
            msg: 'method not allowed',
            allowedMethod: 'DELETE'
        })
        res.writeHead(405, {
            "Content-Type": "application/json"
        })
        res.end(data);
    } else {
        const queryParams = parse(url.parse(req.url).query);
        if(!queryParams.id) {
            res.writeHead(403, {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify({
                msg: "id is required in url query"
            }));
        } else {
            const query = { _id: new ObjectId(queryParams.id as string) }
            Collections.User.deleteOne(query).then((result) : void => {
                if(result['deletedCount'] < 1) {
                    res.writeHead(403, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        id: queryParams.id as string,
                        msg: "record not found"
                    }));
                } else {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        id: queryParams.id as string,
                        msg: "record deleted"
                    }));
                }
            }).catch((e : Error) => {
                const msg = JSON.stringify({
                    msg: e.message
                })
                res.writeHead(500, {
                    "Content-Type": "application/json"
                });
                res.end(msg);
            });

        }
    }
}

export default PostRouter;