const manifestUri =
    'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';

async function init() {
  // When using the UI, the player is made automatically by the UI object.
// "local" because it is for local playback only, as opposed to the player proxy
// object, which will route your calls to the ChromeCast receiver as necessary.
const localPlayer = new shaka.Player(videoElement);
// "Overlay" because the UI will add DOM elements inside the container,
// to visually overlay the video element
const ui = new shaka.ui.Overlay(localPlayer, videoContainerElement,
  videoElement);

// As with DOM-based setup, get access to the UI controls and player from the
// UI.
const controls = ui.getControls();

// These are cast-enabled proxy objects, so that when you are casting,
// your API calls will be routed to the remote playback session.
const player = controls.getPlayer();
const video = controls.getVideo();

  // Attach player and ui to the window to make it easy to access in the JS console.
  window.player = player;
  window.ui = ui;

  // Listen for error events.
  player.addEventListener('error', onPlayerErrorEvent);
  controls.addEventListener('error', onUIErrorEvent);

  controls.addEventListener('caststatuschanged', onCastStatusChanged);

  function onCastStatusChanged(event) {
    const newCastStatus = event['newStatus'];
    // Handle cast status change
    console.log('The new cast status is: ' + newCastStatus);
  }

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  } catch (error) {
    onPlayerError(error);
  }
}

function onPlayerErrorEvent(errorEvent) {
  // Extract the shaka.util.Error object from the event.
  onPlayerError(event.detail);
}

function onPlayerError(error) {
  // Handle player error
  console.error('Error code', error.code, 'object', error);
}

function onUIErrorEvent(errorEvent) {
  // Extract the shaka.util.Error object from the event.
  onPlayerError(event.detail);
}

function initFailed(errorEvent) {
  // Handle the failure to load; errorEvent.detail.reasonCode has a
  // shaka.ui.FailReasonCode describing why.
  console.error('Unable to load the UI library!');
}

// Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded.
document.addEventListener('shaka-ui-loaded', init);
// Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
// to load (e.g. due to lack of browser support).
document.addEventListener('shaka-ui-load-failed', initFailed);