const approuter = require('@sap/approuter');
const { getuserinfoHandler } = require('./getuserinfo-handler');

const ar = approuter();

// Eigene Erweiterung des Application Routers: liefert Informationen
// ueber den angemeldeten Benutzer an die Oberflaeche aus. Die Logik selbst
// steckt in getuserinfo-handler.js, damit sie ohne laufenden Application
// Router testbar ist (siehe test/getuserinfo-handler.test.js).
ar.beforeRequestHandler.use('/getuserinfo', getuserinfoHandler);

ar.start();
