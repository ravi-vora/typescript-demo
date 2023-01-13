import * as dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse, Server } from 'http';
import * as url from 'url';
import PostRouter from './routes/PostRouter.js';
import { connectToDatabase } from './services/database.service.js';

dotenv.config();

connectToDatabase().then(() : void => {

    /**
     * configuring server
     */
    const server : Server = createServer((req: IncomingMessage, res: ServerResponse) : void => {
        try {
            const path : string = url.parse(req.url).pathname;
            if (PostRouter[path]) PostRouter[path](req, res);
            else {
                const msg : string = JSON.stringify({
                    msg: "Not found"
                })
                res.writeHead(404, {
                    "Content-Type": "application/json"
                })
                res.end(msg);
            }
        } catch (e) {
            const msg : string = JSON.stringify({
                msg: e.message
            })
            res.writeHead(500, { 
                "Content-Type": "application/json"
            })
            res.end(msg);
        }
    });
    
    const port : number = parseInt(process.env.PORT)
    
    
    /**
     * server listening
     */
    server.listen(port || 3000, () => {
        console.log(`server is listening on port : ${port}.`);
    }).on("error", (error: Error) : void => {
        console.log(`Server crashed : ${error.message}`);
    })

}).catch((error: Error) : void => {
    console.log(`Database connection failed : ${error.message}`)
    process.exit();
})