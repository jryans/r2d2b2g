// patch startDebugger to add actors and pingback simulator manager on ready.
{
  debug("patch RemoteDebugger.start");

  // add simulator actors
  let presimulator_RemoteDebugger_start = RemoteDebugger.start.bind(RemoteDebugger);
  RemoteDebugger.start = function simulatorRemoteDebuggerStart() {
    presimulator_RemoteDebugger_start(); // call original RemoteDebugger.start
    DebuggerServer.addActors('chrome://prosthesis/content/actors/simulator.js');
    DebuggerServer.addActors('chrome://prosthesis/content/actors/geolocation.js');
    DebuggerServer.addActors('chrome://prosthesis/content/actors/geolocation-ui.js');
    // NOTE: add temporary simulatorWebAppsActor
    DebuggerServer.addActors('chrome://prosthesis/content/actors/webapps.js');
    // Register our copy of styleeditor until it gets uplifted to b2g18
    DebuggerServer.addActors('chrome://prosthesis/content/actors/styleeditor.js');
    DebuggerServer.addTabActor(DebuggerServer.StyleEditorActor, "styleEditorActor");
    DebuggerServer.removeTabActor(DebuggerServer.WebConsoleActor);
    DebuggerServer.removeGlobalActor(DebuggerServer.WebConsoleActor);
    DebuggerServer.addActors('chrome://prosthesis/content/actors/webconsole.js');
  };

  // allow remote debugger connection without any user confirmation
  RemoteDebugger.prompt = function() {
    this._promptDone = true;
    this._promptAnswer = true;
    return true;
  };
}
