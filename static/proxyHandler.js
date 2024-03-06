import StrShuffler from "/lib/StrShuffler.js";
import Api from "/lib/api.js";
function openIncog(url){
win = window.open();
win.document.body.height = '100vw';
win.document.body.style.margin = '0px';
frame = win.document.createElement("iframe");
frame.style.margin = '0px';
frame.style.border = 'none';
frame.style.zIndex = '99999';
frame.style.width = '100%';
frame.style.height = '100%';
frame.src = url;
win.document.body.appendChild(frame);
}
async function checkForRedirect(){
const api = new Api();
var sessionId = localStorage.getItem("sessionId");
const shuffleDict = await api.shuffleDict(sessionId);
var shuffler = new StrShuffler(shuffleDict);
function endsWith(string, string2){
  if(string.slice(string.length - string2.length, string.length) == string2){
    return true;
  } else{
    return false;
  }
}
if(window.self == window.top){
openIncog(location.href);
location.href = "https://www.google.com";
}
if(__uv$config){
  var mainUrl = new URL(__uv$config.decodeUrl(location.href.slice(location.origin.length + __uv$config.prefix.length, location.href.length)));
  if(endsWith(mainUrl.hostname, ".nvidia.com") || endsWith(mainUrl.hostname, ".geforcenow.com") || endsWith(mainUrl.hostname, ".now.gg") || mainUrl.hostname == "now.gg"){
    location.href = "/" + sessionId + "/" + shuffler.shuffle(mainUrl.href);
  }
} else{
  var mainUrl = new URL(shuffler.unshuffle(location.href.replace(location.origin + "/" + sessionId + "/", "")));
  if(!(endsWith(mainUrl.hostname, ".nvidia.com") || endsWith(mainUrl.hostname, ".geforcenow.com") || endsWith(mainUrl.hostname, ".now.gg") || mainUrl.hostname == "now.gg")){
  let x = await fetch("/uv/uv.bundle.js");
  let y = await x.text();
  eval(y);
  let a = await fetch("/uv/uv.config.js");
  let b = await a.text();
  eval(b);
  location.href = __uv$config.prefix + __uv$config.encodeUrl(mainUrl.href);
  }
}
}
checkForRedirect();
