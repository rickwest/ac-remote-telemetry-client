// AC Remote Telemetry specification https://docs.google.com/document/d/1KfkZiIluXZ6mMhLWfDX1qAGbvhGRC3ZUzjVIt5FQpp4/pub

import * as dgram from 'dgram';
import {EventEmitter} from 'events';
import HandshakerResponseParser from "./parsers/HandshakerResponseParser";
import RTCarInfoParser from "./parsers/RTCarInfoParser";
import RTLapParser from "./parsers/RTLapParser";

/**
 * The connection port number of the Assetto Corsa server (ACServer)
 *
 * @type {number}
 */
const AC_SERVER_PORT = 9996;

/**
 * [not used in the current Remote Telemetry version by AC] In future version this field will identify the AC Remote Telemetry version that the device expects to speak with.
 *
 * @type {number}
 */
const AC_SERVER_VERSION = 1;

/**
 * [not used in the current Remote Telemetry version by AC] In future versions it will identify the platform type of the client.
 * This will be used to adjust a specific behaviour for each platform.
 *
 * @type {{eAndroidTablet: number, eIPhoneDevice: number, eIPadDevice: number, eAndroidPhone: number}}
 */
const deviceIdentifier = {
    eIPhoneDevice: 0,
    eIPadDevice: 1,
    eAndroidPhone: 2,
    eAndroidTablet: 3,
};


/**
 * This is the type of operation required by the client. The following operations are now available:
 * HANDSHAKE: This operation identifier must be set when the client wants to start the communication.
 * SUBSCRIBE_UPDATE: This operation identifier must be set when the client wants to be updated from the specific ACServer.
 * SUBSCRIBE_SPOT: This operation identifier must be set when the client wants to be updated from the specific ACServer just for SPOT Events (e.g.: the end of a lap).
 * DISMISS: This operation identifier must be set when the client wants to leave the communication with ACServer.
 *
 * @type {{DISMISS: number, SUBSCRIBE_SPOT: number, HANDSHAKE: number, SUBSCRIBE_UPDATE: number}}
 */
const operation = {
    HANDSHAKE: 0,
    SUBSCRIBE_UPDATE: 1,
    SUBSCRIBE_SPOT: 2,
    DISMISS: 3,
};

/**
 * Constants representing the events emitted by the client
 *
 * @type {{HANDSHAKER_RESPONSE: string, RT_LAP: string, RT_CAR_INFO: string}}
 */
const event = {
    HANDSHAKER_RESPONSE: 'HANDSHAKER_RESPONSE',
    RT_CAR_INFO: 'RT_CAR_INFO',
    RT_LAP: 'RT_LAP',
};

class ACRemoteTelemetryClient extends EventEmitter {
    /**
     * The ACRemoteTelemetryClient constructor
     * @param acServerId
     */
    constructor(acServerId) {
        super();

        this.acServerIp = acServerId;
        this.client = dgram.createSocket('udp4');
    }

    /**
     * Start listening for messages.
     */
    start() {
        if (!this.client) {
            return;
        }

        this.client.on('listening', () => {
            console.log(`UDP Client listening on ${this.acServerIp}:${AC_SERVER_PORT} 🏎`);
        });

        this.client.on('message', (msg, rinfo) => {
            this.parseMessage(msg, rinfo);
        });
    }

    /**
     * Close the client.
     */
    stop() {
        if (!this.client) {
            return;
        }

        return this.client.close(() => {
            console.log(`UDP Client closed 🏁`);
            this.client = null;
        });
    }

    /**
     *
     * @param operation
     * @param identifier
     * @param version
     */
    sendHandshaker(operation, identifier = deviceIdentifier.eIPhoneDevice, version = AC_SERVER_VERSION) {
        const message = new Buffer(12);

        message.writeInt32LE(identifier, 0);
        message.writeInt32LE(version, 4);
        message.writeInt32LE(operation, 8);

        this.client.send(message, 0, message.length, AC_SERVER_PORT, this.acServerIp)
    }

    /**
     *
     */
    handshake() {
        this.sendHandshaker(operation.HANDSHAKE);
    }

    /**
     *
     */
    subscribeUpdate() {
        this.sendHandshaker(operation.SUBSCRIBE_UPDATE);
    }

    /**
     *
     */
    subscribeSpot() {
        this.sendHandshaker(operation.SUBSCRIBE_SPOT);
    }

    /**
     *
     */
    dismiss() {
        this.sendHandshaker(operation.DISMISS);
    }

    /**
     *
     * @param msg
     * @param rinfo
     */
    parseMessage(msg, rinfo) {
        switch(rinfo.size) {
            case 408:
                this.emit(event.HANDSHAKER_RESPONSE, new HandshakerResponseParser().fromBuffer(msg));
                break;
            case 328:
                this.emit(event.RT_CAR_INFO, new RTCarInfoParser().fromBuffer(msg));
                break;
            case 212:
                this.emit(event.RT_LAP, new RTLapParser(msg).fromBuffer(msg));
                break;
        }
    }
}

module.exports = ACRemoteTelemetryClient;
