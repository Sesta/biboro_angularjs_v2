import ShortcutTask from "../shortcut/shortcut.task";

class FluxController {
    constructor($scope, Dispatcher) {
        'ngInject';

        this._scope = $scope;
        this._dispatcher = Dispatcher;

        this._scope.$on("$destroy", this.onDestruct.bind(this));

        this.dispatchToken = [];

        if (navigator.userAgent.match('Mac OS X')) {
            this._scope.CMD_KEY = "⌘";
        } else {
            this._scope.CMD_KEY = "Ctrl";
        }
        
    }

    registerCallbacks(callbacks) {
        for(var storeType in callbacks) {
            
            this._scope[storeType] = {
                _callback: callbacks[storeType]
            };
            
            var dispatchToken = this._dispatcher.register(storeType, this._scope[storeType]._callback.bind(this));
            this.dispatchToken.push(dispatchToken);
        }
    }

    onDestruct() {

        ShortcutTask.clearTask(this._shortcutTaskToken);
        ShortcutTask.clearParallelTask(this._shortcutParallelTaskToken);

        this._dispatcher.detach(this.dispatchToken);
    }

    generateHash()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}

export default FluxController;