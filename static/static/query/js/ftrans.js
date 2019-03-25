"use strict";

if (typeof Ftrans === "undefined") var Ftrans = {}; var FtransControl = {};

// Transfer 的相关配置
Ftrans.TransferConfig = {
    "initializeTimeout": 1000,
    //"utbpInstallPath": '//' + window.location.host,
    "utbpInstallPath": '//192.168.100.230:8000',
    "minVersion": "2.2.0.0",
    "detectRetryNumber": 3,
    "scanInterval": 3000
}

// 帮助方法
Ftrans.Utils = (function () {

    var

      FTRANS_URL = "ftrans://initialize",

      ua = typeof navigator !== 'undefined' ? navigator.userAgent : '',

      BROWSER = {
          OPERA: /opera|opr/i.test(ua),
          IE: /msie|trident/i.test(ua),
          CHROME: /chrome|crios|crmo/i.test(ua) && !/opera|opr/i.test(ua),
          FIREFOX: /firefox|iceweasel/i.test(ua),
          SAFARI: /safari/i.test(ua)
      };

    (function () {
        /*  Add TIMEOUT arguments support to IE < 9
         *  https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers.setTimeout
         */
        if (document.all && !window.setTimeout.isPolyfill) { var __nativeST__ = window.setTimeout; window.setTimeout = function (e, t) { var n = Array.prototype.slice.call(arguments, 2); return __nativeST__(e instanceof Function ? function () { e.apply(null, n) } : e, t) }, window.setTimeout.isPolyfill = !0 } if (document.all && !window.setInterval.isPolyfill) { var __nativeSI__ = window.setInterval; window.setInterval = function (e, t) { var n = Array.prototype.slice.call(arguments, 2); return __nativeSI__(e instanceof Function ? function () { e.apply(null, n) } : e, t) }, window.setInterval.isPolyfill = !0 }
    }());

    var createError = function (errorCode, message) {
        var internalMessage = "";
        if (errorCode == -1) {
            internalMessage = "Invalid request";
        }
        return { error: { code: errorCode, internal_message: internalMessage, user_message: message } };
    };

    //转换Json
    var parseJson = function (str) {
        var obj;
        if (typeof str === "string" && (str.length === 0 || str.replace(/\s/g, "") === "{}")) {
            return {};
        }
        try {
            obj = JSON.parse(str);
        } catch (e) {
            obj = createError(-1, e);
        }
        return obj;
    };

    //版本参数比较  
    var versionLessThan = function (a, b) {
        // console.log("versionLessThan :" + a + ", " + b);
        var versionToArray = function (version) {
            var splits = version.split(".");
            var versionArray = new Array();
            for (var i = 0; i < splits.length; i++) {
                if (isNaN(parseInt(splits[i]))) {
                    Ftrans.utils.logger('Warning: Version contains non-numbers');
                }
                versionArray.push(parseInt(splits[i], 10));
            }
            return versionArray;
        };
        var a_arr = versionToArray(a);
        var b_arr = versionToArray(b);
        // keep a_arr.length=b_arr.length
        if (a_arr.length < b_arr.length) {
            var difflength = b_arr.length - a_arr.length;
            for (var i = 0; i < difflength; i++) {
                a_arr.push(0);
            }
        }

        var i;
        for (i = 0; i < Math.min(a_arr.length, b_arr.length) ; i++) {
            // if i=2, a=[0,0,1,0] and b=[0,0,2,0]
            if (a_arr[i] < b_arr[i]) {
                return true;
            }
            // if i=2, a=[0,0,2,0] and b=[0,0,1,0]
            if (a_arr[i] > b_arr[i]) {
                return false;
            }
            // a[i] and b[i] exist and are equal:
            // move on to the next version number
        }
        // all numbers equal (or all are equal and we reached the end of a or b)
        if (a_arr[i] == b_arr[i]) {
            return true;
        }
        return false;
    };

    //生成GUID 
    var generateUuid = function () {
        var date = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = ((date + 16) * Math.random()).toFixed() % 16;
            if (c !== 'x') {
                /*jslint bitwise: true */
                r = r & 0x3 | 0x8;
                /*jslint bitwise: false */
            }
            return r.toString(16);
        });
    };

    var launchConnect = function (userCallback) {
        // console.log("开始启动 ftrans://initialize");
        var callback = function (installed) {
            if (typeof userCallback === 'function') {
                userCallback(installed);
            }
        }
        var isRegistered = false;
        if (BROWSER.CHROME || BROWSER.OPERA) {
            document.body.focus();
            document.body.onblur = function () {
                isRegistered = true;
            };
            //will trigger onblur
            document.location = FTRANS_URL;
            //Note: timeout could vary as per the browser version, have a higher value
            setTimeout(function () {
                document.body.onblur = null;
                callback(isRegistered);
            }, 500);
        } else if (BROWSER.FIREFOX) {
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            //Set iframe.src and handle exception

            try {
                iframe.contentWindow.location.href = FTRANS_URL;
                isRegistered = true;
            } catch (e) { }
            callback(isRegistered);
        }
        else if (BROWSER.SAFARI) {
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            //Set iframe.src and handle exception

            try {
                iframe.contentWindow.location.href = FTRANS_URL;
                isRegistered = true;
            } catch (e) { }
            callback(isRegistered);
        }
        else {
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            //Set iframe.src and handle exception

            try {
                iframe.contentWindow.location.href = FTRANS_URL;
                 isRegistered = true;
            } catch (e) { }
            callback(isRegistered);
        }
        return null;
    };

    function getFullURI(relativeURL) {
        if (typeof relativeURL !== 'string') {
            return null;
        }
        var url = relativeURL;
        var a = document.createElement('a');
        a.href = url;
        var fullURL = a.href;
        if (fullURL.indexOf('/', fullURL.length - 1) !== -1) {
            fullURL = fullURL.slice(0, -1);
        }
        return fullURL;
    };

    // The symbols to export.
    return {
        //CONSTANTS
        FASP_URL: FTRANS_URL,
        BROWSER: BROWSER,
        //FUNCTIONS
        versionLessThan: versionLessThan,
        createError: createError,
        generateUuid: generateUuid,
        launchConnect: launchConnect,
        parseJson: parseJson,
        getFullURI: getFullURI
    };
})();

// Http请求实例化
Ftrans.XMLhttpRequestImplementation = function () {
    //options
    //{sdkLocation: , callback:}
    var init = function (options) {
        //simple http doesn't need initialization or the utbp SDK location
        if (typeof options.callback === 'function') {
            options.callback();
        }
    };

    var isSupportedByBrowser = function () {
        if (getXMLHttpRequest() === null) {
            return false;
        }
        return true
    };

    var getXMLHttpRequest = function () {
        if (typeof XMLHttpRequest === "undefined") {
            XMLHttpRequest = function () {
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                } catch (e) { }
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                } catch (e) { }
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) { }
                // This browser does not support XMLHttpRequest
                return null;
            };
        }
        return new XMLHttpRequest();
    };

    var httpRequest = function (method, path, data, callback, requestId) {
        try{  
            //start request
            var request = getXMLHttpRequest();


            request.onreadystatechange = function (XMLHttpRequestProgressEvent) {
                if (request.readyState != 4) {
                    return;
                }
                //when ready
                callback(request.status, request.responseText, requestId);
            }
            request.open(method, path, true);
            //request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.setRequestHeader("Content-Type", "application/json");
            //request.setRequestHeader("Content-Type", "application/fromdata");
            if (method.toUpperCase() === "GET") {
                request.send();
            } else {
                request.send(data);
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////
    // PUBLIC
    ////////////////////////////////////////////////////////////////////////////////////////

    // The symbols to export.
    return {
        //FUNCTIONS
        isSupportedByBrowser: isSupportedByBrowser,
        init: init,
        httpRequest: httpRequest
    };
};

// 具体的Http请求
Ftrans.RequestHandler = function () {

    ////////////////////////////////////////////////////////////////////////////////////////
    // PRIVATE CONSTANTS
    ////////////////////////////////////////////////////////////////////////////////////////

    var
      //The two possible http requests
      HTTP_METHOD = {
          GET: "GET",
          POST: "POST"
      },
      //ALL the status in which utbp can be
      STATUS = {
          INITIALIZING: 0,
          RETRYING: 1,
          RUNNING: 2,
          FAILED: 3,
          STOPPED: 4
      },
      //The port in which we are going to look for utbp first
      DEFAULT_PORT = 41885,
      //Localhost value for the requests
      LOCALHOST = "http://localhost:",
      //Current version of the utbp Client API
      URI_VERSION_PREFIX = "/client/api/v1",
      //Controls how many ports we want to search from the DEFAULT_PORT
      MAX_PORT_SEARCH = 1;

    ////////////////////////////////////////////////////////////////////////////////////////
    // PRIVATE VARS
    ////////////////////////////////////////////////////////////////////////////////////////

    var
      //Technology we are going to use to make the http requests
      requestImplementation = null,
      //Current connect status
      connectStatus = null,
      //Port in which connect is listening
      connectPort = DEFAULT_PORT,
      //Position in which we are going to store the callbacks for a requests
      nextId = 0,
      //Hash in which we are going to store the callbacks for the requests
      idCallbackHash = {},
      //Array in which we are going to store all the requests that cannot be processed at this time
      requestQueue = [],
      //Listeners for connect status
      statusListener = null,
      //Controls the time between ports rescan
      scanRetryTimeValues = [0, 1];

    ////////////////////////////////////////////////////////////////////////////////////////
    // PRIVATE METHODS
    ////////////////////////////////////////////////////////////////////////////////////////

    var processQueue = function () {
        //process all pending requests
        for (var i = 0; i < requestQueue.length; i++) {
            var requestInfo = requestQueue.pop();
            var fullURL = LOCALHOST + requestInfo.port + URI_VERSION_PREFIX + requestInfo.path;
            requestImplementation.httpRequest(requestInfo.method, fullURL, requestInfo.data, handleResponse, requestInfo.id);
        }
        return null;
    };

    var changeConnectStatus = function (newConnectStatus) {
        connectStatus = newConnectStatus;
        if (connectStatus == STATUS.RUNNING) {
            processQueue();
        }
        if (statusListener !== null) {
            statusListener(connectStatus);
        }
        return null;
    };

    var iteratePortsCallback = function (httpCode, response, requestId) {

        //retrieve wanted value (copy beacuse primitive) and remove request
        var checkedPort = idCallbackHash[requestId].port;
        delete idCallbackHash[requestId];

        //check always if we have found connect, if so stop searching
        if (connectStatus == STATUS.RUNNING || connectStatus == STATUS.STOPPED) {
            return null;
        }

        if (httpCode == 200) {
            // console.log('Found connect in port: ' + checkedPort + " requestId:" + requestId);
            // console.log(response);
            connectPort = checkedPort;
            clearInterval(interval);
            changeConnectStatus(STATUS.RUNNING);
        }
        //else if (checkedPort === DEFAULT_PORT) {
        //    //Check the rest of the ports
        //    for (var port = DEFAULT_PORT + 1; port < (DEFAULT_PORT + MAX_PORT_SEARCH) ; port++) {
        //        var currentRequestId = nextId++;
        //        var method = HTTP_METHOD.GET;
        //        var path = "/system/ping";
        //        var fullURL = LOCALHOST + port + URI_VERSION_PREFIX + path;

        //        var requestInfo = { id: currentRequestId, method: method, port: port, path: path, data: null, callbacks: null };
        //        idCallbackHash[currentRequestId] = requestInfo;

        //        requestImplementation.httpRequest(method, fullURL, null, iteratePortsCallback, currentRequestId);
        //    }
        //}
        return null;
    };


    // 第一次请求 
    var iteratePorts = function (firstRun) {
        //check always if we have found connect or stopped the requests, if so stop searching
        if (connectStatus == STATUS.RUNNING || connectStatus == STATUS.STOPPED) {
            return null;
        } else if (connectStatus == STATUS.INITIALIZING && !firstRun) {
            //Ftrans.Utils.launchConnect();
            changeConnectStatus(STATUS.RETRYING);
        }

        //Set next ping request, we scale back using an exponential function (Fibonacci sequence)
        //var retryTimeS = scanRetryTimeValues[0] + scanRetryTimeValues[1];
        //setTimeout(iteratePorts, retryTimeS * 1000);
        //scanRetryTimeValues[0] = scanRetryTimeValues[1];
        //scanRetryTimeValues[1] = retryTimeS;

        var requestId = nextId++;
        var method = HTTP_METHOD.GET;
        var path = "/system/ping";
        var fullURL = LOCALHOST + DEFAULT_PORT + URI_VERSION_PREFIX + path;
        // console.log("开始ping，路径：" + fullURL);

        var requestInfo = { id: requestId, method: method, port: DEFAULT_PORT, path: path, data: null, callbacks: null };
        idCallbackHash[requestId] = requestInfo;

        requestImplementation.httpRequest(method, fullURL, null, iteratePortsCallback, requestId);

        return null;
    };

    var handleResponse = function (httpCode, response, requestId) {
        if (connectStatus == STATUS.STOPPED) {
            return null;
        }

        var requestInfo = idCallbackHash[requestId];
        if (!requestInfo) {
            //We shouldn't reach this point
            //Received response from server for which there is no callback
            return;
        }
        //connection error (either wrong port or connect not running)
        if (httpCode == 0) {
            //Connect must be running, please start it and reload the page
            if (connectStatus == STATUS.INITIALIZING || connectStatus == STATUS.RUNNING) {
                //change status, relaunch connect, search for connect
                changeConnectStatus(STATUS.RETRYING);
                Ftrans.Utils.launchConnect();
                // iteratePorts();
                // console.log("get httpCode = 0 and start processor")
                processor();
                interval = setInterval(processor, scanInterval);
            }
            //This was a client request, so queue it until we restablish connection with the server
            requestQueue.push(requestInfo);
            return null;
        } else {
            if (connectStatus != STATUS.RUNNING) {
                changeConnectStatus(STATUS.RUNNING);
            }
            var parsedResponse = Ftrans.Utils.parseJson(response);
            if (httpCode == 200 && typeof parsedResponse.error === 'undefined') {
                //Call back with the response retrieved from connect if parsing is ok
                var callback = requestInfo.callbacks.success;
                callback(parsedResponse);
            } else {
                //Call back with error
                var callback = requestInfo.callbacks.error;
                callback(parsedResponse);
            }
            //remove object
            delete idCallbackHash[requestId];
            return null;
        }
        return null;
    };

    ////////////////////////////////////////////////////////////////////////////////////////
    // PUBLIC
    ////////////////////////////////////////////////////////////////////////////////////////

    var addStatusListener = function (callback) {
        statusListener = callback;
    };

    var processClientRequest = function (method, path, data, callbacks) {
        if (connectStatus == STATUS.STOPPED) {
            return null;
        }
        if (callbacks == "" || callbacks == null || typeof callbacks === 'undefined') {
            callbacks = {};
        }
        //Prepare callbacks
        if (typeof callbacks.success !== 'function') {
            callbacks.success = function () { };
        }
        if (typeof callbacks.error !== 'function') {
            callbacks.error = function () { };
        }

        var requestId = nextId++;
        var requestInfo = { id: requestId, method: method, port: connectPort, path: path, data: data, callbacks: callbacks };
        idCallbackHash[requestId] = requestInfo;

        //if connect is not ready, queue the request
        if (connectStatus != STATUS.RUNNING) {
            requestQueue.push(requestInfo);
            return null;
        }

        //construct final URL
        var fullURL = LOCALHOST + connectPort + URI_VERSION_PREFIX + path;
        requestImplementation.httpRequest(method, fullURL, data, handleResponse, requestId);
        return null;
    };

    ////////////////////////////////////////////////////////////////////////////////////////
    // INITIALIZE PLUGINS
    ////////////////////////////////////////////////////////////////////////////////////////

    var init = function (options) {
        //Change connect status to initailizing
        changeConnectStatus(STATUS.INITIALIZING);
        //Find the request implementation that is optimal for this environment
        requestImplementation = (function () {
            //var requestImpl = new Ftrans.PPAPIrequestImplementation();
            //if (requestImpl.isSupportedByBrowser()) {
            //return requestImpl;
            //} 
            //var requestImpl = new Ftrans.NPAPIrequestImplementation();
            //if (requestImpl.isSupportedByBrowser()) {
            //return requestImpl;
            //} 
            var requestImpl = new Ftrans.XMLhttpRequestImplementation();
            if (requestImpl.isSupportedByBrowser()) {
                return requestImpl;
            }
            return "This browser is not supported";
        }());
        if (typeof requestImplementation === 'string') {
            return Ftrans.Utils.createError(-1, requestImplementation);
        }
        //Initialize the request implementations
        var initializedCallback = function () {
            //Set timeout to decide that the launch of connect has failed and that further actions
            //are required
            var initializeTimeoutCallback = function () {
                if (connectStatus != STATUS.RUNNING) {
                    changeConnectStatus(STATUS.FAILED);
                }
            };
            setTimeout(initializeTimeoutCallback, options.initializeTimeout);
            // INITIALIZE CONNECT
            iteratePorts(true);
        };

        var initializationOptions = {
            pluginId: options.pluginId,
            containerId: options.containerId,
            initializeTimeout: options.initializeTimeout,
            sdkLocation: options.sdkLocation,
            detectRetryNumber: options.detectRetryNumber,
            retryTimes: options.retryTimes,
            scanInterval : options.scanInterval,
            callback: initializedCallback
        };
        processor();
        interval = setInterval(processor, scanInterval);
        //requestImplementation.init(initializationOptions);
        return null;
    };
    
    var scanInterval = 1000;
    var currentState = 0;
    var currentDetectTime = 0;
    var detectRetryNumber = 3;
    var retryTimes = 10000;
    var startData;
    var interval;
    var processor = function () {
        switch (currentState) {
            case 0: // 初始状态
                // console.log("流程开始...");
                currentState = 1;
                // console.log("进入检测流程...");
                // break;
            case 1: // 检测流程
                iteratePorts(true);
                currentDetectTime = currentDetectTime + 1;
                if (connectStatus == STATUS.RUNNING) {
                    // ping 通了
                    // console.log("检测流程中第" + currentDetectTime + "次ping通了...");
                    changeConnectStatus(STATUS.RUNNING);
                    currentState = 6;
                    return "ping通了";
                }
                if (currentDetectTime >= detectRetryNumber) {
                    currentState = 2;
                    // console.log("检测流程中超过" + detectRetryNumber + "次都ping不通...");
                    changeConnectStatus(STATUS.INITIALIZING);
                    Ftrans.Utils.launchConnect();
                    startData = Date.now();
                    currentState = 3;
                    // console.log("进入循环流程...");
                }
                break;
            case 2: // 循环流程等待
                //console.log("检测流程中超过" + detectRetryNumber + "次都ping不通...");
                //changeConnectStatus(STATUS.INITIALIZING);
                //Ftrans.Utils.launchConnect();
                //startData = Date.now();
                //currentState = 3;
                //console.log("进入循环流程...");
                break;
            case 3: // 循环流程
                if ((Date.now() - startData) >= retryTimes) {
                    currentState = 4;
                    // console.log("进入一直ping的持续流程...");
                    changeConnectStatus(STATUS.FAILED);
                    currentState = 5;
                    return;
                }

                iteratePorts(true);
                if (connectStatus == STATUS.RUNNING) {
                    // ping 通了
                    // console.log("循环流程中ping通了...");
                    currentState = 6;
                    return "ping通了";
                }
                break;
            case 4: // 持续流程 等待
                //console.log("进入一直ping的持续流程...");
                //changeConnectStatus(STATUS.FAILED);
                //currentState = 5;
                break;
            case 5: // 一直ping
                iteratePorts(true);
                break;
            case 6: // 停止或者结束
                clearInterval(interval);
                // console.log("流程结束...");
                currentState = 0;
                currentDetectTime = 0;
                break;
        }
    }

    var stopRequests = function () {
        connectStatus = STATUS.STOPPED;
        return true;
    };

    return {
        //CONSTANTS
        HTTP_METHOD: HTTP_METHOD,
        STATUS: STATUS,
        //FUNCTIONS
        init: init,
        start: processClientRequest,
        addStatusListener: addStatusListener,
        stopRequests: stopRequests
    }
};

// Ftrans 传输及与UTBP 链接
Ftrans.Initilize = function (options) {

    if (isNullOrUndefinedOrEmpty(options)) {
        options = {};
    }

    Ftrans.Initilize.HTTP_METHOD = {
        GET: "GET",
        POST: "POST"
    };

    Ftrans.Initilize.STATUS = {
        INITIALIZING: "INITIALIZING",
        RETRYING: "RETRYING",
        RUNNING: "RUNNING",
        OUTDATED: "OUTDATED",
        FAILED: "FAILED"
    };

    Ftrans.Initilize.EVENT = {
        ALL: "all",
        TRANSFER: "transfer",
        STATUS: "status"
    };

    Ftrans.Initilize.TRANSFER_STATUS = {
        CANCELLED: "cancelled",
        COMPLETED: "completed",
        FAILED: "failed",
        INITIATING: "initiating",
        QUEUED: "queued",
        REMOVED: "removed",
        RUNNING: "running",
        WILLRETRY: "willretry"
    };

    ////////////////////////////////////////////////////////////////////////////
    // Private constants
    ////////////////////////////////////////////////////////////////////////////

    var
      INITIALIZE_TIMEOUT = options.connectLaunchWaitTimeoutMs || 10000,
      PLUGIN_ID = options.id || "ftrans-web",
      PLUGIN_CONTAINER_ID = options.containerId || "ftrans-web-container",
      SDK_LOCATION = Ftrans.Utils.getFullURI(options.sdkLocation) || '//' + window.location.host,
      APPLICATION_ID = "",
      AUTHORIZATION_KEY = options.authorizationKey || "",
      POLLING_TIME = options.pollingTime || 2000,
      MINIMUM_VERSION = options.minVersion || "",
      DETECTRETRYNUMBER = options.detectRetryNumber || 3, // 检测周期时重连次数  默认：3 单位:次
      RETRYTIMES = options.retryTimes || 10000,           // 循环周期重连时间  默认：10000 单位:ms  
      SCANINTERVAL = options.scanInterval,                // 检测中的扫描间隔  默认：1000 单位:ms
      DRAGDROP_ENABLED = options.dragDropEnabled || false;

    ////////////////////////////////////////////////////////////////////////////
    // Private variables
    ////////////////////////////////////////////////////////////////////////////

    var
      transferListeners = [],
      transferEventIntervalId = 0,
      transferEventIterationToken = 0,
      requestHandler = null,
      statusListeners = [],
      connectVersion = "",
      connectStatus = Ftrans.Initilize.STATUS.INITIALIZING;

    ////////////////////////////////////////////////////////////////////////////
    // Helper Functions
    ////////////////////////////////////////////////////////////////////////////

    /*
     * x - variable we want to check
     * @returns {Boolean} - true if the value is null, empty or undefined
     */
    function isNullOrUndefinedOrEmpty(x) {
        return x === "" || x === null || typeof x === "undefined";
    };

    /*
     * data - obj
     * @returns {Boolean} - true if the value is null, empty or undefined
     */
    function addStandardConnectSettings(data) {
        if (AUTHORIZATION_KEY.length !== 0) {
            data.authorization_key = AUTHORIZATION_KEY;
        }
        if (isNullOrUndefinedOrEmpty(data.ftrans_connect_settings)) {
            data.ftrans_connect_settings = {};
        }
        data.ftrans_connect_settings.app_id = APPLICATION_ID;
        return data;
    };

    function connectHttpRequest(method, path, data, callbacks) {
        if (requestHandler == null) {
            return null;
        }
        var paras = JSON.stringify(data);
        requestHandler.start(method, path, paras, callbacks);
        return null;
    };

    function notifyTransferListeners(response) {
        //First update the iterate token for future requests
        transferEventIterationToken = response.iteration_token;
        //transferEventIterationToken = "test";
        //Notify the listeners
        for (var i = 0; i < transferListeners.length; i++) {
            transferListeners[i](Ftrans.Initilize.EVENT.TRANSFER, response);
        }
    };

    function removeEventListenerHelper(listener, listenerArray) {
        var listenerFound = false;
        var index = listenerArray.indexOf(listener);
        while (index > -1) {
            listenerArray.splice(index, 1);
            listenerFound = true;
            index = listenerArray.indexOf(listener);
        }
        return listenerFound;
    };

    ////////////////////////////////////////////////////////////////////////////
    // Manage Connect Status and high level logic
    ////////////////////////////////////////////////////////////////////////////

    function notifyStatusListeners(notifyStatus) {
        for (var i = 0; i < statusListeners.length; i++) {
            var listener = statusListeners[i](Ftrans.Initilize.EVENT.STATUS, notifyStatus);
        };
    }

    function manageConnectStatus(newStatus) {
        // console.log("manageConnectStatus:" + newStatus);
        if (connectStatus == Ftrans.Initilize.STATUS.OUTDATED) {
            return null;
        }
        if (newStatus == requestHandler.STATUS.INITIALIZING) {
            connectStatus = Ftrans.Initilize.STATUS.INITIALIZING;
        } else if (newStatus == requestHandler.STATUS.RETRYING) {
            connectStatus = Ftrans.Initilize.STATUS.RETRYING;
        } else if (newStatus == requestHandler.STATUS.FAILED) {
            connectStatus = Ftrans.Initilize.STATUS.FAILED;
        } else if (MINIMUM_VERSION != "" && connectVersion == "") {
            var greaterVersion = function (response) {
                connectVersion = response.version;
                if (Ftrans.Utils.versionLessThan(MINIMUM_VERSION, connectVersion)) {
                    connectStatus = Ftrans.Initilize.STATUS.RUNNING;
                } else {
                    connectStatus = Ftrans.Initilize.STATUS.OUTDATED;
                }

                notifyStatusListeners(connectStatus);
            };
            var lowerVersion = function (response) {
                connectStatus = Ftrans.Initilize.STATUS.OUTDATED;
                notifyStatusListeners(connectStatus);
            };
            var versionCallbacks = { success: greaterVersion, error: lowerVersion };
            //connectHttpRequest(Ftrans.Initilize.HTTP_METHOD.POST, "/update/require", {min_version: MINIMUM_VERSION, sdk_location: SDK_LOCATION}, versionCallbacks);
            connectHttpRequest(Ftrans.Initilize.HTTP_METHOD.GET, "/system/info", "", versionCallbacks);
            return null;
        } else {
            //RUNNING and no version required or version already retrieved
            connectStatus = Ftrans.Initilize.STATUS.RUNNING;
        }
        notifyStatusListeners(connectStatus);
    };

    ////////////////////////////////////////////////////////////////////////////
    // API Functions
    ////////////////////////////////////////////////////////////////////////////

    // 链接UTBP监听
    this.addEventListener = function (type, listener) {
        //Check the parameters
        if (typeof type !== typeof Ftrans.Initilize.EVENT.ALL) {
            return Ftrans.Utils.createError(-1, "Invalid EVENT parameter");
        } else if (typeof listener !== 'function') {
            return Ftrans.Utils.createError(-1, "Invalid Listener parameter");
        }
        //Add the listener
        if (type == Ftrans.Initilize.EVENT.TRANSFER || type == Ftrans.Initilize.EVENT.ALL) {
            if (transferEventIntervalId === 0) {
                transferEventIntervalId = setInterval(pollTranfersHelperFunction, POLLING_TIME);
            }
            //Already set a function for polling the status, just add to the queue
            transferListeners.push(listener);
        }
        if (type == Ftrans.Initilize.EVENT.STATUS || type == Ftrans.Initilize.EVENT.ALL) {
            statusListeners.push(listener);
        }
        return null;
    };

    this.getStatus = function () {
        return connectStatus;
    };


    this.initialize = function (applicationId) {
        if (isNullOrUndefinedOrEmpty(APPLICATION_ID)) {
            if (isNullOrUndefinedOrEmpty(applicationId)) {
                // Default appId. Caret prefix differentiates it from a user-specified id.
                APPLICATION_ID = "^" + isNullOrUndefinedOrEmpty(window.location.hostname) ? "localhost" : window.location.hostname;
            } else {
                APPLICATION_ID = applicationId;
            }
        } else {
            return Ftrans.Utils.createError(-1, "Session was already initialized");
        }
        //Initialize requests
        var error = this.start();
        if (error == null) {
            return { "app_id": APPLICATION_ID };
        }
        return error;
    };

    this.removeEventListener = function (type, listener) {
        var listenerFound = false;

        if (typeof type === 'undefined') {
            if (transferListeners.length > 0) {
                transferListeners = [];
                listenerFound = true;
            }
            if (statusListeners.length > 0) {
                statusListeners = [];
                listenerFound = true;
            }
        } else if (typeof type !== typeof Ftrans.Initilize.EVENT.ALL) {
            //The parameter type is actually the listener 
            listenerFound = listenerFound || removeEventListenerHelper(type, transferListeners);
            listenerFound = listenerFound || removeEventListenerHelper(type, statusListeners);
        } else if (typeof listener !== 'function') {
            //The user only provided the type
            //First the TRANSFER events
            if (type === Ftrans.Initilize.EVENT.TRANSFER || type === Ftrans.Initilize.EVENT.ALL) {
                if (transferListeners.length > 0) {
                    transferListeners = [];
                    listenerFound = true;
                }
            }
            //Then the STATUS events
            if (type === Ftrans.Initilize.EVENT.STATUS || type === Ftrans.Initilize.EVENT.ALL) {
                if (statusListeners.length > 0) {
                    statusListeners = [];
                    listenerFound = true;
                }
            }
        } else {
            //The user provided both arguments
            //First the TRANSFER events
            if (type === Ftrans.Initilize.EVENT.TRANSFER || type === Ftrans.Initilize.EVENT.ALL) {
                listenerFound = listenerFound || removeEventListenerHelper(listener, transferListeners);
            }
            //Then the STATUS events
            if (type === Ftrans.Initilize.EVENT.STATUS || type === Ftrans.Initilize.EVENT.ALL) {
                listenerFound = listenerFound || removeEventListenerHelper(listener, statusListeners);
            }
        }
        if (transferListeners.length === 0) {
            clearInterval(transferEventIntervalId);
            transferEventIntervalId = 0;
        }
        return listenerFound;
    };

    this.start = function () {
        // console.log("start");
        if (APPLICATION_ID == "") {
            return Ftrans.Utils.createError(-1, "Please call initialize first");
        }
        requestHandler = new Ftrans.RequestHandler();
        //Add status listener to connect
        requestHandler.addStatusListener(manageConnectStatus);
        //Initialize request
        var options = {
            pluginId: PLUGIN_ID,
            containerId: PLUGIN_CONTAINER_ID,
            initializeTimeout: INITIALIZE_TIMEOUT,
            sdkLocation: SDK_LOCATION,
            detectRetryNumber: DETECTRETRYNUMBER,
            retryTimes: RETRYTIMES,
            scanInterval: SCANINTERVAL
        };
        return requestHandler.init(options);
    };

    // 上传处理
    this.startUploadTransfers = function (transfer_specs, callbacks) {
        if (isNullOrUndefinedOrEmpty(transfer_specs)) {
            return Ftrans.Utils.createError(-1, "Invalid transferSpecs parameter");
        }
        var i, requestId, result, transferSpec;

        requestId = Ftrans.Utils.generateUuid();
        connectHttpRequest(Ftrans.Initilize.HTTP_METHOD.POST, "/direct_tasks/upload_setup", transfer_specs, callbacks);
        return { request_id: requestId };
    };

    // 下载处理
    this.startDownTransfers = function (transfer_specs, callbacks) {
        if (isNullOrUndefinedOrEmpty(transfer_specs)) {
            return Ftrans.Utils.createError(-1, "Invalid transferSpecs parameter");
        }
        var i, requestId, result, transferSpec;

        requestId = Ftrans.Utils.generateUuid();
        connectHttpRequest(Ftrans.Initilize.HTTP_METHOD.POST, "/direct_tasks/download_setup", transfer_specs, callbacks);
        return { request_id: requestId };
    };

    // 下载分享处理
    this.startShareDownTransfers = function (transfer_specs, callbacks) {
        if (isNullOrUndefinedOrEmpty(transfer_specs)) {
            return Ftrans.Utils.createError(-1, "Invalid transferSpecs parameter");
        }
        var i, requestId, result, transferSpec;

        requestId = Ftrans.Utils.generateUuid();
        connectHttpRequest(Ftrans.Initilize.HTTP_METHOD.POST, "/direct_tasks/share_download_setup", transfer_specs, callbacks);
        return { request_id: requestId };
    };
};

// 安装打包
Ftrans.UBTPInstaller = function (options) {

    Ftrans.UBTPInstaller.EVENT = {
        DOWNLOAD_CONNECT: "download",
        REFRESH_PAGE: "refresh",
        IFRAME_REMOVED: "removeiframe",
        IFRAME_LOADED: "iframeloaded"
    };

    ////////////////////////////////////////////////////////////////////////////
    // Private constants
    ////////////////////////////////////////////////////////////////////////////

    var
      EVENT = Ftrans.UBTPInstaller.EVENT,
      DEFAULT_SDK_LOCATION = "//192.168.1.50:806",
      CONNECT_VERSIONS_JS = "/connectversions.min.js";
    ////////////////////////////////////////////////////////////////////////////
    // Private variables
    ////////////////////////////////////////////////////////////////////////////
    var
      connectOptions = {},
      listeners = [],
      connectJSONreferences = null,
      showInstallTimerID = 0,
      iframeLoadedFlag = false,
      iframeLoadedTimerID = 0;

    if (isNullOrUndefinedOrEmpty(options)) {
        options = {};
    }

    connectOptions.iframeId = options.iframeId || 'ftrans-iframe-container';
    connectOptions.sdkLocation = Ftrans.Utils.getFullURI(options.sdkLocation) || DEFAULT_SDK_LOCATION;
    connectOptions.language = options.language == "en-US" ? "en-US" : null;    // 语言版本 目前只支持中文（zh-CN）和英文（en-US），默认中文
    connectOptions.stylesheetLocation = Ftrans.Utils.getFullURI(options.stylesheetLocation);

    ////////////////////////////////////////////////////////////////////////////
    // Helper Functions
    ////////////////////////////////////////////////////////////////////////////

    /*
     * loadFiles(files, type, callback) -> null
     * - files (Array): Set of files to load
     * - type (String): type of the files to load: `js` or `css`
     * - callback (function): to be called when all scripts provided have been loaded,
     *   no arguments provided.
     *
     */
    var loadiframe = function (callback) {
        if (typeof callback === 'function') {
            //head = document.getElementsByTagName("head")[0] || document.documentElement;
            callback(true);
        }
    }

    var loadFiles = function (files, type, callback) {
        if (files === null || typeof files === 'undefined' || !(files instanceof Array)) {
            return null;
        } else if (type === null || typeof type !== 'string') {
            return null;
        }
        var
          numberOfFiles = 0,
          head = document.getElementsByTagName("head")[0] || document.documentElement;

        /* Loads the file given, and sets a callback, when the file is the last one and a callback is
         * provided, it will call it
         * Loading mechanism based on https://jquery.org (MIT license)
         */
        var loadFilesHelper = function (file) {
            //IE9+ supports both script.onload AND script.onreadystatechange thus the done check
            var
              done = false,
              fileref = null;

            if (type.toLowerCase() === "js") {
                fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", file);
            } else if (type.toLowerCase() === "css") {
                fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", file);
            } else {
                return null;
            }
            if (typeof callback === 'function') {
                // Attach handlers for all browsers
                fileref.onload = fileref.onreadystatechange = function () {
                    if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                        done = false;
                        // Handle memory leak in IE
                        fileref.onload = fileref.onreadystatechange = null;
                        if (head && fileref.parentNode) {
                            head.removeChild(fileref);
                        }
                        if (--numberOfFiles <= 0 && typeof callback === 'function') {
                            callback(true);
                        }
                    }
                };
                fileref.onerror = function () {
                    callback(false);
                };
            }
            // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
            head.insertBefore(fileref, head.firstChild);
        }
        numberOfFiles = files.length;
        for (var i = 0; i < numberOfFiles; i++) {
            if (typeof files[i] === 'string') {
                loadFilesHelper(files[i]);
            }
        }
    };

    var osPlatform = function () {
        var os = "Not supported"
        if (/Win/.test(navigator.platform)) {
            if (navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1) {
                os = "Win64";
            } else {
                os = "Win32";
            }
        }
        else if (/Mac OS X 10[._]6/.test(navigator.userAgent)) {
            os = "MacIntel-10.6-legacy"
        } else if (/Mac/.test(navigator.platform)) {
            os = "MacIntel";
        } else if (/Linux x86_64/.test(navigator.platform)) {
            os = "Linux x86_64";
        } else if (/Linux/.test(navigator.platform)) {
            os = "Linux i686";
        }
        return os;
    };

    var osVersion = function () {
        var match = "";
        if (/Win/.test(navigator.platform)) {
            match = navigator.userAgent.match(/Windows NT (\d+)[._](\d+)/);
        } else if (/Mac/.test(navigator.platform)) {
            match = navigator.userAgent.match(/OS X (\d+)[._](\d+)/);
        }
        if (isNullOrUndefinedOrEmpty(match))
            return null;
        var os_version = {
            highWord: parseFloat(match[1]),
            loWord: parseFloat(match[2])
        }
        return os_version;
    };

    var platformVersion = function (arg0) {
        if (!isNullOrUndefinedOrEmpty(arg0)) {
            var match = arg0.match(/(\d+)[.](\d+)/);
            if (isNullOrUndefinedOrEmpty(match))
                return null;
            var platform_version = {
                highWord: parseFloat(match[1]),
                loWord: parseFloat(match[2])
            }
            return platform_version;
        }
        return arg0;
    }

    var notifyListeners = function (event) {
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](event);
        }
    };

    var addStyleString = function (str) {
        var node = document.createElement('style');
        node.setAttribute('type', 'text/css');
        //fix for <= IE9
        if (node.styleSheet) {
            node.styleSheet.cssText = str;
        } else {
            node.innerHTML = str;
        }
        document.body.appendChild(node);
    };

    /*
     * x - variable we want to check
     * @returns {Boolean} - true if the value is null, empty or undefined
     */
    function isNullOrUndefinedOrEmpty(x) {
        return x === "" || x === null || typeof x === "undefined";
    };

    var addEventListener = function (listener) {
        if (typeof listener !== 'function') {
            return null;
        }
        listeners.push(listener);
        return null;
    };

    var installationJSON = function (callback) {
        if (typeof callback !== 'function') {
            return null;
        }
        if (connectJSONreferences !== null) {
            callback(connectJSONreferences);
            return null;
        }
        var updatesURL = DEFAULT_SDK_LOCATION;
        var replaceJSONWithFullHref = function (connectversionsSdkLocation, entryJSON) {
            for (var i = 0; i < entryJSON.links.length; i++) {
                var hrefLink = entryJSON.links[i].href;
                if (!/^https?:\/\//i.test(hrefLink) && !/^\/\//.test(hrefLink)) {
                    entryJSON.links[i].hrefAbsolute = connectversionsSdkLocation + '/' + hrefLink;
                }
            }
        };
        //load references from file and parse to load in the iframe
        var parseIstallJSON = function (connectversionsSdkLocation) {
            var parsedInstallJSON = Ftrans.connectVersions;
            var installEntries = parsedInstallJSON.entries;

            var procesJSONentry = function (entryJSON) {
                replaceJSONWithFullHref(connectversionsSdkLocation, entryJSON);
                connectJSONreferences = entryJSON;
                callback(entryJSON);
            };
            var userOS = osPlatform();
            for (var i = 0; i < installEntries.length; i++) {
                var entry = installEntries[i];
                if (entry.navigator.platform === userOS) {
                    var userOSVersion = osVersion();
                    var currentPlatform = platformVersion(entry.platform.version);
                    if (!isNullOrUndefinedOrEmpty(currentPlatform) && !isNullOrUndefinedOrEmpty(userOSVersion)) {
                        if ((userOSVersion.highWord > currentPlatform.highWord) ||
                            (userOSVersion.highWord >= currentPlatform.highWord &&
                            userOSVersion.loWord >= currentPlatform.loWord)) {
                            procesJSONentry(entry);
                            return null;
                        }
                    } else {
                        procesJSONentry(entry);
                        return null;
                    }
                }
            }
        };
        var scriptLoaded = function (success) {
            var fallbackURL = connectOptions.sdkLocation;
            if (success && Ftrans.connectVersions != undefined) {
                parseIstallJSON(updatesURL);
            } else if (updatesURL !== fallbackURL) {
                updatesURL = fallbackURL;
                //loadFiles([updatesURL + CONNECT_VERSIONS_JS], 'js', scriptLoaded);
                loadiframe(scriptLoaded);
            }
        };
        //loadFiles([updatesURL + CONNECT_VERSIONS_JS], 'js', scriptLoaded);
        loadiframe(scriptLoaded);
        return null;
    };

    /*
     * Ftrans.UBTPInstaller#show(eventType) -> null
     * - eventType (String): the event type
     *
     * ##### Event types
     *
     * 1. `connecting` (`String`).
     * 2. `unable-to-launch` (`String`).
     * 3. `refresh` (`String`).
     * 4. `outdated` (`String`).
     * 5. `running` (`String`).
     *
     **/
    var show = function (eventType) {
        //We always need to check if launching was going to be popped up, if so delete it
        if (showInstallTimerID !== 0) {
            clearTimeout(showInstallTimerID);
        }
        var iframe = document.getElementById(connectOptions.iframeId);
        //IE will complain that in strict mode functions cannot be nested inside a statement, so we have to define it here
        function handleMessage(event) {
            // console.log("handleMessage:" + event.data);
            // iFrame installation: Handling of messages by the parent window.
            if (event.data === EVENT.DOWNLOAD_CONNECT) {
                notifyListeners(event.data);
                showInstall();
            } else if (event.data === EVENT.REFRESH_PAGE) {
                notifyListeners(event.data);
                //Fix for refreshing only window in which we are contained, if we are an iframe just refresh the iframe (Sharepoint bug)
                var inIframe = false;
                try {
                    inIframe = window.self !== window.top;
                } catch (e) {
                    inIframe = true;
                }
                var refreshWindow = inIframe ? contentWindow : window;
                // console.log("start refresh window");
                refreshWindow.location.reload(true);
            } else if (event.data === EVENT.IFRAME_REMOVED) {
                notifyListeners(event.data);
                dismiss();
            }
        };
        //IE will complain that in strict mode functions cannot be nested inside a statement, so we have to define it here
        function iframeLoaded() {
            iframeLoadedFlag = true;
            notifyListeners(EVENT.IFRAME_LOADED);
            var iframe = document.getElementById(connectOptions.iframeId);
            //Set dialog type
            iframe.contentWindow.postMessage(eventType, "*");
            //populate the iframe with the information pulled from connectversions.js
            var populateIframe = function (eventType) {
                //for (var i = 0; i < referencesJSON.links.length; i++) {
                //  var link = referencesJSON.links[i];
                //  if (link.rel === 'enclosure') {
                //    if (typeof iframe !== 'undefined' && iframe !== null) {
                //        iframe.contentWindow.postMessage('downloadlink=' + link.hrefAbsolute, "*");
                //    }
                //  }
                //}
                iframe.contentWindow.postMessage(eventType, "*");
            }
            installationJSON(populateIframe);
            //load an stylesheet if provided
            if (connectOptions.stylesheetLocation) {
                // Inserting a stylesheet into the DOM for more manageable styles.
                if (typeof iframe !== 'undefined' && iframe !== null) {
                    iframe.contentWindow.postMessage('insertstylesheet=' + connectOptions.stylesheetLocation, "*");
                }
            }
            notifyListeners(EVENT.IFRAME_LOADED);
        };
        if (!iframe) {
            //Set iframe styling
            addStyleString('.' + connectOptions.iframeId + '{position: absolute;width: 100%;height: 80px;margin: 0px;padding: 0px;border: none;outline: none;overflow: hidden;top: 0px;left: 0px;z-index: -999999999}');
            // Build and insert the iframe.
            var iframe = document.createElement('iframe');
            iframe.id = connectOptions.iframeId;
            iframe.className = connectOptions.iframeId;
            iframe.frameBorder = '0';
            iframe.src = connectOptions.sdkLocation + '/ftrans_web/ftrans_js/banner.html';
            // iframe.src = "banner.html";
            document.body.appendChild(iframe);
            //Check for tight security policies
            if (!iframe.contentWindow.postMessage) {
                return;
            }

            // Set listener for messages from the iframe installer.
            if (window.attachEvent) {
                window.attachEvent("onmessage", handleMessage);
            } else {
                window.addEventListener("message", handleMessage, false);
            }
        }
        if (iframeLoadedFlag) {
            iframe.contentWindow.postMessage(eventType, "*");
        } else {
            //Give time to the iFrame to be loaded #31040
            if (iframe.attachEvent)
                iframe.attachEvent('onload', iframeLoaded);
            else
                iframe.onload = iframeLoaded;
        }
    };

    /**
     * Ftrans.UBTPInstaller#showLaunching(timeout) -> null
     * - timeout (Number): (*optional*) Timeout to show the banner in milliseconds. If at any point 
     * during this timeout [[Ftrans.UBTPInstaller#connected]] or [[Ftrans.UBTPInstaller#dismiss]] 
     * are called, the banner will not show up. Default: `1500`.
     *
     * Displays a banner in the top of the screen explaining the user that ftrans Connect 
     * is trying to be launched.
     *
     **/
    var showLaunching = function (timeout) {
        timeout = typeof timeout === 'number' ? timeout : 1500;
        if (showInstallTimerID !== 0) {
            clearTimeout(showInstallTimerID);
        }
        if (null != connectOptions.language) {
            show(connectOptions.language);
        }
        var showLaunchingHelperFunction = function () {
            show('launching');
        };
        showInstallTimerID = setTimeout(showLaunchingHelperFunction, timeout);
    };

    /**
     * Ftrans.UBTPInstaller#showDownload() -> null
     *
     * Displays a banner in the top of the screen urging the user to download Ftrans UTBP.
     *
     **/
    var showDownload = function () {
        show('download');
    };

    /**
     * Ftrans.UBTPInstaller#showInstall() -> null
     *
     * Displays a banner in the top of the screen explaining the user what he has to do once
     * ftrans Connect has been downloaded
     *
     **/
    var showInstall = function () {
        show('install');
    };

    /**
     * Ftrans.UBTPInstaller#showUpdate() -> null
     *
     * Displays a banner in the top of the screen urging the user to update ftrans utbp
     * to the latest version.
     *
     **/
    var showUpdate = function () {
        show('update');
    };

    /**
     * Ftrans.UBTPInstaller#utbped(timeout) -> null
     * - timeout (Number): (*optional*) If specified, this will add a timeout to the 
     * dismiss function. Default: `2000`.
     *
     * Displays a temporary message that utbp has been found, and after *timeout* dismisses the
     * banner
     *
     **/
    var connected = function (timeout) {
        timeout = typeof timeout === 'number' ? timeout : 2000;
        clearTimeout(showInstallTimerID);
        var iframe = document.getElementById(connectOptions.iframeId);
        if (typeof iframe !== 'undefined' && iframe !== null) {
            show('running');
            setTimeout(dismiss, timeout);
        }
        return null;
    };

    /**
     * Ftrans.UBTPInstaller#dismiss() -> null
     *
     * Dismisses the banner
     *
     **/
    var dismiss = function () {
        if (showInstallTimerID !== 0) {
            clearTimeout(showInstallTimerID);
        }
        var iframe = document.getElementById(connectOptions.iframeId);
        if (typeof iframe !== 'undefined' && iframe !== null) {
            iframe.parentNode.removeChild(iframe);
        }
        return null;
    };

    // The symbols to export.
    return {
        //FUNCTIONS
        addEventListener: addEventListener,
        installationJSON: installationJSON,
        showLaunching: showLaunching,
        showDownload: showDownload,
        showInstall: showInstall,
        showUpdate: showUpdate,
        connected: connected,
        dismiss: dismiss
    };
};

// Ftrans 初始化
Ftrans.Transfer = {
    ftransWeb: "",
    ftransInstaller:"",
    initFtrans : function (languageType) {
        //var utbpInstallPath = '//' + window.location.host;
        var utbpInstallPath = '//192.168.100.230:8000';
        Ftrans.Transfer.ftransWeb = new Ftrans.Initilize({
            sdkLocation: Ftrans.TransferConfig.utbpInstallPath || utbpInstallPath,
            minVersion: Ftrans.TransferConfig.minVersion || '1.0.0.0',
            connectLaunchWaitTimeoutMs: Ftrans.TransferConfig.initializeTimeout,
            detectRetryNumber: Ftrans.TransferConfig.detectRetryNumber,
            scanInterval: Ftrans.TransferConfig.scanInterval
        });
        Ftrans.Transfer.ftransInstaller = new Ftrans.UBTPInstaller({
            sdkLocation: Ftrans.TransferConfig.utbpInstallPath || utbpInstallPath,
            language: languageType == "en-US" ? "en-US" : null
        });
        var statusEventListener = function (eventType, data) {
            var status = Ftrans.Initilize.STATUS;
            if (eventType === Ftrans.Initilize.EVENT.STATUS) {
                if (data === status.INITIALIZING) {
                    Ftrans.Transfer.ftransInstaller.showLaunching();
                }
                if (data === status.FAILED) {
                    Ftrans.Transfer.ftransInstaller.showDownload();
                }
                if (data === status.OUTDATED) {
                    Ftrans.Transfer.ftransInstaller.showUpdate();
                }
                if (data === status.RUNNING) {
                    Ftrans.Transfer.ftransInstaller.connected();
                }
            }
        };
        Ftrans.Transfer.ftransWeb.initialize();
        Ftrans.Transfer.ftransWeb.addEventListener(Ftrans.Initilize.EVENT.STATUS, statusEventListener);

        FtransControl = {};
        //FtransControl.transferSpec = "";
        // 下载文件(对外调用接口)
        FtransControl.downloadFiles = function (address, paths, accessToken, callbacks) {
            if (Ftrans.Transfer.ftransWeb.getStatus() != Ftrans.Initilize.STATUS.RUNNING) {
                Ftrans.Transfer.ftransInstaller.showDownload();
            } else {
                FtransControl.transferSpec = {
                    "access_token": accessToken,
                    "source_paths": [],
                    "dest_path": "",
                    "front_address": address,
                    "allow_dialog": true
                };
                //var path;
                for (var i = 0; i < paths.length; i++) {
                    var path = { "source": paths[i], "dest": "" };
                    FtransControl.transferSpec.source_paths.push(path);
                }

                Ftrans.Transfer.ftransWeb.startDownTransfers(FtransControl.transferSpec, callbacks);
            }
        };

        // 上传文件(对外调用接口)
        FtransControl.uploadFiles = function (number, address, destPath, allowFileType, selectType, accessToken, callbacks) {
            if (Ftrans.Transfer.ftransWeb.getStatus() != Ftrans.Initilize.STATUS.RUNNING) {
                Ftrans.Transfer.ftransInstaller.showDownload();
            } else {
                FtransControl.transferSpec = {
                    "access_token": accessToken,
                    "front_address": address,
                    "dest_path": destPath,
                    "allow_dialog": true,
                    "allow_multiselect": true,
                    "allow_file_type": allowFileType,
                    "select_type": selectType,
                    "param": number
                };

                Ftrans.Transfer.ftransWeb.startUploadTransfers(FtransControl.transferSpec, callbacks);
            }
        };

        // 下载分享文件(对外调用接口)
        FtransControl.downloadShareFiles = function (address, paths, shareId, password, accessToken, callbacks) {
            if (Ftrans.Transfer.ftransWeb.getStatus() != Ftrans.Initilize.STATUS.RUNNING) {
                Ftrans.Transfer.ftransInstaller.showDownload();
            } else {
                FtransControl.transferSpec = {
                    "access_token": accessToken,
                    "share_id": shareId,
                    "share_password": password,
                    "source_paths": [],
                    "dest_path": "",
                    "front_address": address,
                    "allow_dialog": true
                }
                var path;
                for (var i = 0; i < paths.length; i++) {
                    path = { "source": paths[i], "dest": "" };
                    FtransControl.transferSpec.source_paths.push(path);
                }

                Ftrans.Transfer.ftransWeb.startShareDownTransfers(FtransControl.transferSpec, callbacks);
            }
        };
    }
};