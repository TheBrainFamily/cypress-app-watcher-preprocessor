const ipc = require("node-ipc");
const browserifyPreprocessor = require("@cypress/browserify-preprocessor");

let filesToRerun = [];
const setUpIpcServer = () => {
  ipc.config.id = "cypress-rerun-with-app";
  ipc.config.retry = 1500;
  ipc.config.silent = true;

  ipc.serve(function() {
    ipc.server.on("message", function(data) {
      ipc.log("got a message : ".debug, data);
      filesToRerun.forEach(file => file.emit("rerun"));
    });
    ipc.server.on("socket.disconnected", function(socket, destroyedSocketID) {
      ipc.log("client " + destroyedSocketID + " has disconnected!");
    });
  });
  ipc.server.start();
};

setUpIpcServer();
const watchApp = preprocessor => file => {
  if (!filesToRerun.find(f => f.filePath === file.filePath)) {
    filesToRerun.push(file);
    file.on("close", () => {
      console.log("closing!", file.filePath);
      filesToRerun = filesToRerun.filter(f => f.filePath !== file.filePath);
    });
  }
  if (!preprocessor) {
    preprocessor = browserifyPreprocessor(
      browserifyPreprocessor.defaultOptions
    );
  }
  return preprocessor(file);
};

module.exports = watchApp;
