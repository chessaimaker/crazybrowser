import StrShuffler from "./lib/StrShuffler.js";
import Api from "./lib/api.js";
var sessionId, httpProxy, shuffling;
function setError(err) {
    if (err) {
alert("err");
    }
}

window.addEventListener("error", setError);

(function () {
    const api = new Api();
    var localStorageKey = "rammerhead_sessionids";
    var localStorageKeyDefault = "rammerhead_default_sessionid";
    var sessionIdsStore = {
        get() {
            var rawData = localStorage.getItem(localStorageKey);
            if (!rawData) return [];
            try {
                var data = JSON.parse(rawData);
                if (!Array.isArray(data)) throw "getout";
                return data;
            } catch (e) {
                return [];
            }
        },
        set(data) {
            if (!data || !Array.isArray(data)) throw new TypeError("must be array");
            localStorage.setItem(localStorageKey, JSON.stringify(data));
        },
        getDefault() {
            var sessionId = localStorage.getItem(localStorageKeyDefault);
            if (sessionId) {
                var data = sessionIdsStore.get();
                data.filter(function (e) {
                    return e.id === sessionId;
                });
                if (data.length) return data[0];
            }
            return null;
        },
        setDefault(id) {
            localStorage.setItem(localStorageKeyDefault, id);
        }
    };
    function loadSettings(session) {
        sessionId = session.id;
        httpProxy = session.httpproxy || "";
        shuffling = typeof session.enableShuffling === "boolean" ? session.enableShuffling : true;
    }
    function loadSessions() {
        var sessions = sessionIdsStore.get();
        var defaultSession = sessionIdsStore.getDefault();
        if (defaultSession) loadSettings(defaultSession);
    }
    function addSession(id) {
        var data = sessionIdsStore.get();
        data.unshift({ id: id, createdOn: new Date().toLocaleString() });
        sessionIdsStore.set(data);
    }
    function editSession(id, httpproxy, enableShuffling) {
        var data = sessionIdsStore.get();
        for (var i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                data[i].httpproxy = httpproxy;
                data[i].enableShuffling = enableShuffling;
                sessionIdsStore.set(data);
                return;
            }
        }
        throw new TypeError("cannot find " + id);
    }

    api.get("/mainport").then((data) => {
        var defaultPort = window.location.protocol === "https:" ? 443 : 80;
        var currentPort = window.location.port || defaultPort;
        var mainPort = data || defaultPort;
        if (currentPort != mainPort) window.location.port = mainPort;
    });

    api.needpassword().then(doNeed => {
        if (doNeed) {
            document.getElementById("password-wrapper").style.display = "";
        }
    });
    window.addEventListener("load", function () {
        loadSessions();
function makeNewSession(){
            setError();
            api.newsession().then((id) => {
                addSession(id);
                sessionId = id;
                httpProxy = "";
                localStorage.setItem("sessionId", sessionId);
            });
        }
        async function go(url) {
            setError();
            const id = sessionId;
            const httpproxy = httpProxy;
            const enableShuffling = shuffling;
            if (!id) return setError("must generate a session id first");
            const value = api.sessionexists(id);
            if (!value) return setError("session does not exist. try deleting or generating a new session");
            await api.editsession(id, httpproxy, enableShuffling);
            editSession(id, httpproxy, enableShuffling);
            const shuffleDict = await api.shuffleDict(id);
            if (!shuffleDict) {
                window.location.href = "/" + id + "/" + url.replace("://", ":/");
            } else {
                var shuffler = new StrShuffler(shuffleDict);
                window.location.href = "/" + id + "/" + shuffler.shuffle(url);
            }
        }
    });
})();
