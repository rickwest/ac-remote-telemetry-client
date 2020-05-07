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
    const str = buf.toString('binary', start, start + length);
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
    rtCarInfo.gear = message.readInt32LE(68);
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


    // RPM = BitConverter.ToSingle(UDPBytes.Skip(68).Take(4).ToArray, 0)
    // Gear = BitConverter.ToInt32(UDPBytes.Skip(76).Take(4).ToArray, 0) - 1
    // LapTime = BitConverter.ToUInt32(UDPBytes.Skip(40).Take(4).ToArray, 0)
    // LastLap = BitConverter.ToUInt32(UDPBytes.Skip(44).Take(4).ToArray, 0)
    // BestLap = BitConverter.ToUInt32(UDPBytes.Skip(48).Take(4).ToArray, 0)
    // LapCount = BitConverter.ToUInt32(UDPBytes.Skip(52).Take(4).ToArray, 0)
    // GForceVert = BitConverter.ToSingle(UDPBytes.Skip(28).Take(4).ToArray, 0)
    // GForceLon = BitConverter.ToSingle(UDPBytes.Skip(36).Take(4).ToArray, 0)
    // GForceLat = BitConverter.ToSingle(UDPBytes.Skip(32).Take(4).ToArray, 0)
    // Gas = BitConverter.ToSingle(UDPBytes.Skip(56).Take(4).ToArray, 0)
    // Brake = BitConverter.ToSingle(UDPBytes.Skip(60).Take(4).ToArray, 0)
    // Clutch = BitConverter.ToSingle(UDPBytes.Skip(64).Take(4).ToArray, 0)
    // Steer = BitConverter.ToSingle(UDPBytes.Skip(72).Take(4).ToArray, 0)
    // PositionNormalized = BitConverter.ToSingle(UDPBytes.Skip(308).Take(4).ToArray, 0)
    // CarPosition(0) = BitConverter.ToSingle(UDPBytes.Skip(316).Take(4).ToArray, 0)
    // CarPosition(1) = BitConverter.ToSingle(UDPBytes.Skip(320).Take(4).ToArray, 0)
    // CarPosition(2) = BitConverter.ToSingle(UDPBytes.Skip(324).Take(4).ToArray, 0)
    // CarSLope = BitConverter.ToSingle(UDPBytes.Skip(312).Take(4).ToArray, 0)
}

function getHandshakerResponse(message) {
    const handshakerResponse = {};

    handshakerResponse.carName = readString(message, 0, 100);
    handshakerResponse.driverName = readString(message, 100, 100);
    // handshakerResponse.identifier = readString();
    // handshakerResponse.version = readString();
    // handshakerResponse.trackName = readString();
    // handshakerResponse.trackConfig = readString();
    return handshakerResponse;
}

send(operations.HANDSHAKE);
