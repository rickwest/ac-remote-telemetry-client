import ACRemoteTelemetryParser from './ACRemoteTelemetryParser';

class HandshakerResponseParser extends ACRemoteTelemetryParser {
    constructor() {
        super();

        this.endianess('little')
            .string('carName', {encoding: 'utf-16le', length: 100, stripNull: true}) // Offset: 0
            .string('driverName', {encoding: 'utf-16le', length: 100}) // Offset: 100
            .int32le('identifier') // Offset: 200
            .int32le('version') // Offset: 204
            .string('trackName', {encoding: 'utf-16le', length: 100, stripNull: true}) // Offset: 208
            .string('trackConfig', {encoding: 'utf-16le', length: 100, stripNull: true}); // Offset: 308
    }
}

export default HandshakerResponseParser;
