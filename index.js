// AC Remote Telemetry specification https://docs.google.com/document/d/1KfkZiIluXZ6mMhLWfDX1qAGbvhGRC3ZUzjVIt5FQpp4/pub

const dgram = require('dgram');

const acServerIp = '192.168.0.44';
const acServerPort = 9996;

const operations = {
    HANDSHAKE: 0,
    SUBSCRIBE_UPDATE: 1,
    SUBSCRIBE_SPOT: 2,
    DISMISS: 3,
};

let state = 0;

const client = dgram.createSocket('udp4');

client.on("message", (message) => {
    if (state == 0) { // initial handshake not yet received
        // Map data returned from handshake
        const handshakerResponse = getHandshakerResponse(message);

        console.log("Handshake received");

        console.log(handshakerResponse);

        send(operations.SUBSCRIBE_UPDATE);

        state = 1
    } else if (state == 1) { // initial handshake received
        const rTCarInfo = getRTCarInfo(message);

        console.log(rTCarInfo);
    }
});

function readString(buf, start, length) {
    const str = buf.toString('utf16le', start, start + length);
    const parts = str.split('%');
    return parts[0];
}

function send(operation) {
    const message = new Buffer(12);

    message.writeInt32LE(1, 0); // identifier, 0 = eIPhoneDevice
    message.writeInt32LE(1, 4); // version
    message.writeInt32LE(operation, 8); // operation

    client.send(message, 0, message.length, acServerPort, acServerIp)
}

function getRTCarInfo(message) {
    const rtCarInfo = {};

    // rtCarInfo.identifier;
    // rtCarInfo.size;

    rtCarInfo.speedKmh = message.readFloatLE(8);
    rtCarInfo.speedMph = message.readFloatLE(12);
    rtCarInfo.speedMs = message.readFloatLE(16);

    // rtCarInfo.isAbsEnabled;
    // rtCarInfo.isAbsInAction;
    // rtCarInfo.isTcInAction;
    // rtCarInfo.isTcEnabled;
    // rtCarInfo.isInPit;
    // rtCarInfo.isEngineLimiterOn;

    // rtCarInfo.accG_vertical;
    // rtCarInfo.accG_horizontal;
    // rtCarInfo.accG_frontal;
    //
    // rtCarInfo.lapTime;
    // rtCarInfo.lastLap;
    // rtCarInfo.bestLap;
    // rtCarInfo.lapCount;
    //
    // rtCarInfo.gas;
    // rtCarInfo.brake;
    // rtCarInfo.clutch;
    rtCarInfo.engineRPM = message.readFloatLE(68);
    // rtCarInfo.steer;
    rtCarInfo.gear = message.readInt32LE(76); //  0: Revers, 1: Neutral, 2: First Gear etc...
    // rtCarInfo.cgHeight;

    // rtCarInfo.wheelAngularSpeed[4];
    // rtCarInfo.slipAngle[4];
    // rtCarInfo.slipAngle_ContactPatch[4];
    // rtCarInfo.slipRatio[4];
    // rtCarInfo.tyreSlip[4];
    // rtCarInfo.ndSlip[4];
    // rtCarInfo.load[4];
    // rtCarInfo.Dy[4];
    // rtCarInfo.Mz[4];
    // rtCarInfo.tyreDirtyLevel[4];
    //
    // rtCarInfo.camberRAD[4];
    // rtCarInfo.tyreRadius[4];
    // rtCarInfo.tyreLoadedRadius[4];
    //
    // rtCarInfo.suspensionHeight[4];
    //
    // rtCarInfo.carPositionNormalized;
    //
    // rtCarInfo.carSlope;
    //
    // rtCarInfo.carCoordinates[3];

    return rtCarInfo;
}

function getHandshakerResponse(message) {
    const handshakerResponse = {};

    // 1 utf-16 character is 2 bytes so string length of 50 characters requires reading 100 bytes.
    handshakerResponse.carName = readString(message, 0, 100);
    handshakerResponse.driverName = readString(message, 100, 100);
    handshakerResponse.identifier = message.readInt32LE(200); // 4 bytes
    handshakerResponse.version = message.readInt32LE(204); // 4 bytes
    handshakerResponse.trackName = readString(message, 208,100);
    handshakerResponse.trackConfig = readString(message,308, 100);
    return handshakerResponse;
}

send(operations.HANDSHAKE);
