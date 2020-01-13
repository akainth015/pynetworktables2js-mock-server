# pynetworktables2js-mock-server
A server to mock a connection to a robot with pynetworktables2js

Clone it, run `npm install`, then run `node index.js path to backup CBOR file) (port #)`

In your website, modify the `networktables.js` script tag as follows.
~~~
<script data-nt-host="localhost:(port #)" src="(script URL)"></script>
~~~

# The backup file
This can be obtained with the [Team 846 dashboard](https://github.com/Team846/frc-dashboard), which is a general-purpose robot configuration dashboard. If for any reason that dashboard is no-longer general, an older version is available on my own GitHub, https://github.com/akainth015/frc-dashboard.

If using the dashboard is not possible, it is simply an object serialized with CBOR, this is a trivial task in any language with support for [CBOR](https://cbor.io).

Here is an example written in JavaScript.
~~~
const cbor = require("cbor");
const fs = require("fs");

const backupContents = {
  "/Preferences/Drivetrain/joystickMultiplier": 15,
  "/Team 846 is supreme": true
  // add as many keys as is necessary
};

fs.writeFileSync("backup.cbor", cbor.encode(backupContents));
~~~
