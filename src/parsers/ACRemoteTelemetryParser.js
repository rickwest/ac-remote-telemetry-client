import { Parser } from 'binary-parser';

class ACRemoteTelemetryParser extends Parser {
  /**
     * @param {Buffer} buffer
     */
  fromBuffer(buffer) {
    return this.parse(buffer);
  }
}

export default ACRemoteTelemetryParser;
