import ACRemoteTelemetryParser from './ACRemoteTelemetryParser';

class RTLapParser extends ACRemoteTelemetryParser {
  constructor() {
    super();

    this.endianess('little')
      .int32le('carIdentifierNumber') // Offset: 0
      .int32le('lap') // Offset: 4
      .string('driverName', { encoding: 'utf-16le', length: 100 }) // Offset: 8
      .string('carName', { encoding: 'utf-16le', length: 100, stripNull: true }) // Offset: 108
      .int32le('time'); // Offset: 208
  }
}

export default RTLapParser;
