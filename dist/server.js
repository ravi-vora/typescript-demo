import * as dotenv from 'dotenv';
import { createServer } from 'http';
import * as url from 'url';
import PostRouter from './routes/PostRouter.js';
import { connectToDatabase } from './services/database.service.js';
dotenv.config();
connectToDatabase().then(() => {
    /**
     * configuring server
     */
    const server = createServer((req, res) => {
        try {
            const path = url.parse(req.url).pathname;
            if (PostRouter[path])
                PostRouter[path](req, res);
            else {
                const msg = JSON.stringify({
                    msg: "Not found"
                });
                res.writeHead(404, {
                    "Content-Type": "application/json"
                });
                res.end(msg);
            }
        }
        catch (e) {
            const msg = JSON.stringify({
                msg: e.message
            });
            res.writeHead(500, {
                "Content-Type": "application/json"
            });
            res.end(msg);
        }
    });
    const port = parseInt(process.env.PORT);
    /**
     * server listening
     */
    server.listen(port || 3000, () => {
        console.log(`server is listening on port : ${port}.`);
    }).on("error", (error) => {
        console.log(`Server crashed : ${error.message}`);
    });
}).catch((error) => {
    console.log(`Database connection failed : ${error.message}`);
    process.exit();
});
//# sourceMappingURL=server.js.map