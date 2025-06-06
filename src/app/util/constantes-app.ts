import { environment } from "src/environments/environment";
function loadJSON(filePath) {
  const json = loadTextFileAjaxSync(filePath, "application/json");
  return JSON.parse(json);
}

function loadTextFileAjaxSync(filePath, mimeType) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status === 200) {
    return xmlhttp.responseText;
  } else {
    return null;
  }
}

export const params = loadJSON("assets/parametres.json");
export const host: string = params.ip + ":" + params.port + params.context;
export const ID_CSEC = params.ID_CSEC;
export const TIMEOUT = params.TIME_OUT;
