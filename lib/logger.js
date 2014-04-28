define(function (require) {

    var io = window.io,
        socket;
    
    _.extend(logger, Backbone.Events);
    
    var isRemoteLogging;

    if (socket) {
        logger.on("log", function (data) {
            if (isRemoteLogging) {
                socket.emit("log", data);
            }
        });
    }

    function logger(moduleId) {
        var moduleArgs = [];
        
        if (moduleId) {
            moduleArgs = ["%c " + moduleId, "color: darkgrey"];
        }
        
        return function () {
            var logArgs = [].slice.call(arguments);
            
            console.log.apply(console, moduleArgs.concat(logArgs));
            logger.trigger("log", [moduleId].concat(logArgs));
        };
    }
    
    logger.remoteLogging = function (value) {
        if (value === undefined) {
            return isRemoteLogging;
        }
        
        if (value) {
            socket = io && io.connect("");
            if (socket) {
                isRemoteLogging = true;
            } else {
                throw new Error("Sorry no remote logging transport available");
            }
        } else {
            isRemoteLogging = false;
        }
    };
    
    return logger;
});
