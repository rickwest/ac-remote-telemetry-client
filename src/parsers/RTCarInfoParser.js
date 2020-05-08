import ACRemoteTelemetryParser from './ACRemoteTelemetryParser';

class RTCarInfoParser extends ACRemoteTelemetryParser {
    constructor() {
        super();

        this.endianess('little')
            .string('identifier', {encoding: 'utf-16le', length: 4, stripNull: true}) // Offset: 0
            .int32le('size') // Offset: 4

            .floatle('speedKmh') // Offset: 8
            .floatle('speedMph') // Offset: 12
            .floatle('speedMs') // Offset: 16

            .int8('isAbsEnabled') // Offset: 20
            .int8('isAbsInAction') // Offset: 21
            .int8('isTcInAction') // Offset: 22
            .int8('isTcEnabled') // Offset: 23
            .int8('isInPit;') // Offset: 24
            .int8('isEngineLimiterOn') // Offset: 25
            .skip(2) // Unknown 2 bytes

            .floatle('accGVertical') // Offset: 28
            .floatle('accGHorizontal') // Offset: 32
            .floatle('accGFrontal') // Offset: 36

            .int32le('lapTime') // Offset: 40
            .int32le('lastLap') // Offset: 44
            .int32le('bestLap') // Offset: 48
            .int32le('lapCount') // Offset: 52

            .floatle('gas') // Offset: 56
            .floatle('brake') // Offset: 60
            .floatle('clutch') // Offset: 64
            .floatle('engineRPM') // Offset: 68
            .floatle('steer') // Offset: 72
            .int32le('gear') // Offset: 76
            .floatle('cgHeight') // Offset: 80

            .floatle('wheelAngularSpeed1') // Offset: 84
            .floatle('wheelAngularSpeed2') // Offset: 88
            .floatle('wheelAngularSpeed3') // Offset: 92
            .floatle('wheelAngularSpeed4') // Offset: 96

            .floatle('slipAngle1') // Offset: 100
            .floatle('slipAngle2') // Offset: 104
            .floatle('slipAngle3') // Offset: 108
            .floatle('slipAngle4') // Offset: 112

            .floatle('slipAngleContactPatch1') // Offset: 116
            .floatle('slipAngleContactPatch2') // Offset: 120
            .floatle('slipAngleContactPatch3') // Offset: 124
            .floatle('slipAngleContactPatch4') // Offset: 128

            .floatle('slipRatio1') // Offset: 132
            .floatle('slipRatio2') // Offset: 136
            .floatle('slipRatio3') // Offset: 140
            .floatle('slipRatio4') // Offset: 144

            .floatle('tyreSlip1') // Offset: 148
            .floatle('tyreSlip2') // Offset: 152
            .floatle('tyreSlip3') // Offset: 156
            .floatle('tyreSlip4') // Offset: 160

            .floatle('ndSlip1') // Offset: 164
            .floatle('ndSlip2') // Offset: 168
            .floatle('ndSlip3') // Offset: 172
            .floatle('ndSlip4') // Offset: 176

            .floatle('load1') // Offset: 180
            .floatle('load2') // Offset: 184
            .floatle('load3') // Offset: 188
            .floatle('load4') // Offset: 192

            .floatle('Dy1') // Offset: 196
            .floatle('Dy2') // Offset: 200
            .floatle('Dy3') // Offset: 204
            .floatle('Dy4') // Offset: 208

            .floatle('Mz1') // Offset: 212
            .floatle('Mz2') // Offset: 216
            .floatle('Mz3') // Offset: 220
            .floatle('Mz4') // Offset: 224

            .floatle('tyreDirtyLevel1') // Offset: 228
            .floatle('tyreDirtyLevel2') // Offset: 232
            .floatle('tyreDirtyLevel3') // Offset: 236
            .floatle('tyreDirtyLevel4') // Offset: 240

            .floatle('camberRAD1') // Offset: 244
            .floatle('camberRAD2') // Offset: 248
            .floatle('camberRAD3') // Offset: 252
            .floatle('camberRAD4') // Offset: 256

            .floatle('tyreRadius1') // Offset: 260
            .floatle('tyreRadius2') // Offset: 264
            .floatle('tyreRadius3') // Offset: 268
            .floatle('tyreRadius4') // Offset: 272

            .floatle('tyreLoadedRadius1') // Offset: 276
            .floatle('tyreLoadedRadius2') // Offset: 280
            .floatle('tyreLoadedRadius3') // Offset: 284
            .floatle('tyreLoadedRadius4') // Offset: 288

            .floatle('suspensionHeight1') // Offset: 292
            .floatle('suspensionHeight2') // Offset: 296
            .floatle('suspensionHeight3') // Offset: 300
            .floatle('suspensionHeight4') // Offset: 304

            .floatle('carPositionNormalized') // Offset: 308

            .floatle('carSlope') // Offset: 312

            .floatle('carCoordinatesX') // Offset: 316
            .floatle('carCoordinatesY') // Offset: 320
            .floatle('carCoordinatesZ') // Offset: 324
    }
}

export default RTCarInfoParser;
