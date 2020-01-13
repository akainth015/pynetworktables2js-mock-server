const cbor = require("cbor");
const WebSocket = require("ws");

const fs = require("fs");

async function loadCborFile(path) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(path);
        const decoder = new cbor.Decoder();

        decoder.on("data", backup => resolve(backup));
        decoder.on("error", error => reject(error));

        readStream.pipe(decoder);
    });
}

async function main() {
    console.debug(process.argv);
    if (process.argv[2] === undefined) {
        console.error("A back file to use as a configuration must be provided as the first argument");
    }

    const MockNetworkTables = await loadCborFile(process.argv[2]);

    const port = process.argv[3] || 8888;
    const webSocketServer = new WebSocket.Server({
        path: "/networktables/ws",
        port: port
    }, () => console.info(`Started a mock pynetworktables2js server on port ${port}`));

    webSocketServer.on("connection", websocket => {
        websocket.on("message", message => {
            const update = cbor.decode(message);
            MockNetworkTables[update.k] = update.v;
        });

        websocket.send(cbor.encode({
            r: true,
            a: "Mocked NetworkTables"
        }));

        for (let key in MockNetworkTables) {
            websocket.send(cbor.encode({
                k: key,
                v: MockNetworkTables[key],
                n: true
            }));
        }
    });
}

main();