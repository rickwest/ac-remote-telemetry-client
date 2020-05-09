# Assetto Corsa Remote Telemetry Client

This is a JavaScript UDP client and telemetry parser for Assetto Corsa.

Assetto Corsa supports remote telemetry communication via UDP socket. This exposed telemetry data can then be consumed by external applications or connected peripherals for a range of purposes, such as providing extended telemetry display, motion platform hardware support or providing force feedback data for custom steering wheels.

More information can be found in the [AC Remote Telemetry Documentation](https://docs.google.com/document/d/1KfkZiIluXZ6mMhLWfDX1qAGbvhGRC3ZUzjVIt5FQpp4/pub).

---

## Getting started

### Install this module

npm:
```
npm install ac-remote-telemetry-client
```

### How to use this module

```js
import { ACRemoteTelemetryClient } from 'ac-remote-telemetry-client';
// const ACRemoteTelemetryClient = require('ac-remote-telemetry-client');

const client = new ACRemoteTelemetryClient();

// Implement desired listeners
client.on('HANDSHAKER_RESPONSE', (data) => console.log(data));
client.on('RT_CAR_INFO', (data) => console.log(data));
client.on('RT_LAP', (data) => console.log(data));

// Start listening
client.start();

// Send initial handshake
client.handshake();

// Subscribe to desired updates
client.subscribeUpdate();
client.subscribeSpot();

// Stop listening
client.stop();
```

### Data Examples
