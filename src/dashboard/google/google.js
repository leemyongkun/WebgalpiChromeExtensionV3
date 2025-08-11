const CLIENT_ID =
  "193252333713-j91q3e6p75o5g836o8s7kb5ka2ovik3c.apps.googleusercontent.com";
const API_KEY = "Kt09L4H4hglL78qJcqot1r1j";
const SCOPES = ["https://www.googleapis.com/auth/drive"];
let $ = require("jquery");
import gapi from "gapi-client";

function handleClientLoad() {
  gapi.client.setApiKey(API_KEY);
  window.setTimeout(checkAuth, 1);
}

function checkAuth() {
  var options = {
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: true
  };
  gapi.auth.authorize(options, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById("authorize-button");

  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = "hidden";
    makeApiCall();
  } else {
    authorizeButton.style.visibility = "";
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  var options = {
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: false
  };
  gapi.auth.authorize(options, handleAuthResult);
  return false;
}

function makeApiCall() {
  gapi.client.load("drive", "v2", makeRequest);
}

function makeRequest() {
  var request = gapi.client.drive.files.list({ maxResults: 5 });
  request.execute(function(resp) {
    for (i = 0; i < resp.items.length; i++) {
      var titulo = resp.items[i].title;
      var fechaUpd = resp.items[i].modifiedDate;
      var userUpd = resp.items[i].lastModifyingUserName;
      var userEmbed = resp.items[i].embedLink;
      var userAltLink = resp.items[i].alternateLink;

      var fileInfo = document.createElement("li");
      fileInfo.appendChild(
        document.createTextNode(
          "TITLE: " +
            titulo +
            " - LAST MODIF: " +
            fechaUpd +
            " - BY: " +
            userUpd
        )
      );
      document.getElementById("content").appendChild(fileInfo);
    }
  });
}
