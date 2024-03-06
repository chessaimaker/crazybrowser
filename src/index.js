import express from 'express';
import wisp from "wisp-server-node";
import createRammerhead from "../rammerhead/src/server/index.js";
import { createBareServer } from '@tomphttp/bare-server-node';
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { hostname } from "node:os";
import serveStatic from "serve-static";
import { Socket } from "net";
// The following message MAY NOT be removed
console.log("Rammerhead easy deployment version\nThis program comes with ABSOLUTELY NO WARRANTY.\nThis is free software, and you are welcome to redistribute it\nunder the terms of the GNU General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\n(at your option) any later version.\n\nYou should have received a copy of the GNU General Public License\nalong with this program. If not, see <https://www.gnu.org/licenses/>.\n");
const bareServer = createBareServer('/bare/');
const rh = createRammerhead();
const server = createServer();
const app = express(server);
// used when forwarding the script
const rammerheadScopes = [
	"/rammerhead.js",
	"/hammerhead.js",
	"/transport-worker.js",
	"/task.js",
	"/iframe-task.js",
	"/worker-hammerhead.js",
	"/messaging",
	"/sessionexists",
	"/deletesession",
	"/newsession",
	"/editsession",
	"/needpassword",
	"/syncLocalStorage",
	"/api/shuffleDict"
];
const rammerheadSession = /^\/[a-z0-9]{32}/;

function shouldRouteRh(req) {
	const url = new URL(req.url, "https://0.0.0.0");
	return (rammerheadScopes.includes(url.pathname) || rammerheadSession.test(url.pathname));
}
function endsWith(string, string2){
  if(string.slice(string.length - string2.length, string.length) == string2){
    return true;
  } else{
    return false;
  }
}
function routeRhRequest(req, res) {
  rh.emit("request", req, res);
}
app.use(serveStatic(fileURLToPath(new URL("../static/", import.meta.url))));
app.all("/*", (req, res) => {
	var windowLocation = req.url;
	windowLocation = windowLocation.split("/");
	if(endsWith(windowLocation[1], "!f")){
		windowLocation[1] = windowLocation[1].slice(0, windowLocation[1].length - 2);
		windowLocation = windowLocation.join("/");
		res.redirect(windowLocation)
	} else{
		res.status(404).send("404 Not Found");
	}
})
server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else if (shouldRouteRh(req)) {
    routeRhRequest(req, res);
  } else {
    app(req, res);
  }
});
server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else if (shouldRouteRh(req)) {
    routeRhUpgrade(req, socket, head);
  } else {
    wisp.routeRequest(req, socket as Socket, head);
  }
});
server.on("listening", () => {
  const addr = server.address();

  console.log(`Server running on port ${addr.port}`)
  console.log("");
  console.log("You can now view it in your browser.")
  /* Code for listing IPS from website-aio */
  console.log(`Local: http://${addr.family === "IPv6" ? `[${addr.address}]` : addr.address}${addr.port === 80? "" : ":" + addr.port}`);
  console.log(`Local: http://localhost${addr.port === 80? "" : ":" + addr.port}`);
  try { console.log(`On Your Network: http://${hostname()}${addr.port === 80? "" : ":" + addr.port}`); } catch (err) {/* Can't find LAN interface */};
});

server.listen({ port: process.env.PORT || 8080 })
