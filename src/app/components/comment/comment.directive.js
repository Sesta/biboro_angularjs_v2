import CommentController from "./comment.controller";

class CommentDirective {

    constructor () {
        'ngInject';

        let directive = {
            restrict: 'E',
            scope: {
                snippet: '=',
                outsideClickedCallback: '=',
            },
            controller: CommentController,
            controllerAs: 'comment',
            templateUrl: 'app/components/comment/comment.html',
            link: this.linkFunc,
        };

        return directive;
    }

    linkFunc(scope) {
        document.querySelector(".dialog-background").addEventListener('click',function() {
            if(typeof scope.outsideClickedCallback === 'function') {
                scope.outsideClickedCallback();
                scope.$apply();
            }
        }, true);
    }

}

export default CommentDirective;
