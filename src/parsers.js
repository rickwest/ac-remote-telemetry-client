class ACRemoteTelemetryParser {
    constructor() {
        this.data = {};
    }

    /**
     * @param buffer
     * @param start
     * @param length
     * @returns {string}
     */
    readString(buffer, start, length) {
        const str = buffer.toString('utf16le', start, start + length);
        const parts = str.split('%');
        return parts[0];
    }
}

class HandshakerResponseParser extends ACRemoteTelemetryParser {
    constructor(msg) {
        super();

        this.data.carName = this.readString(msg, 0, 100);
        this.data.driverName = this.readString(msg, 100, 100);
        this.data.identifier = msg.readInt32LE(200); // 4 bytes
        this.data.version = msg.readInt32LE(204); // 4 bytes
        this.data.trackName = this.readString(msg, 208,100);
        this.data.trackConfig = this.readString(msg,308, 100);
    }
}

class RTCarInfoParser extends ACRemoteTelemetryParser {
    constructor(msg) {
        super();

        this.data.speedKmh = msg.readFloatLE(8);
        this.data.speedMph = msg.readFloatLE(12);
        this.data.speedMs = msg.readFloatLE(16);
        // this.data.identifier;
        // this.data.size;

        // this.data.isAbsEnabled;
        // this.data.isAbsInAction;
        // this.data.isTcInAction;
        // this.data.isTcEnabled;
        // this.data.isInPit;
        // this.data.isEngineLimiterOn;

        // this.data.accG_vertical;
        // this.data.accG_horizontal;
        // this.data.accG_frontal;
        //
        // this.data.lapTime;
        // this.data.lastLap;
        // this.data.bestLap;
        // this.data.lapCount;
        //
        // this.data.gas;
        // this.data.brake;
        // this.data.clutch;
        this.data.engineRPM = msg.readFloatLE(68);
        // this.data.steer;
        this.data.gear = msg.readInt32LE(76); //  0: Revers, 1: Neutral, 2: First Gear etc...
        // this.data.cgHeight;

        // this.data.wheelAngularSpeed[4];
        // this.data.slipAngle[4];
        // this.data.slipAngle_ContactPatch[4];
        // this.data.slipRatio[4];
        // this.data.tyreSlip[4];
        // this.data.ndSlip[4];
        // this.data.load[4];
        // this.data.Dy[4];
        // this.data.Mz[4];
        // this.data.tyreDirtyLevel[4];
        //
        // this.data.camberRAD[4];
        // this.data.tyreRadius[4];
        // this.data.tyreLoadedRadius[4];
        //
        // this.data.suspensionHeight[4];
        //
        // this.data.carPositionNormalized;
        //
        // this.data.carSlope;
        //
        // this.data.carCoordinates[3];
    }
}

class RTLapParser extends ACRemoteTelemetryParser {
    constructor(msg) {
        super();
    }
}

export {HandshakerResponseParser, RTCarInfoParser, RTLapParser};
