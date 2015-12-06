class CellsDirective {
    constructor () {
        'ngInject';

        let directive = {
            restrict: 'C',
            link: this.linkFunc.bind(this),
        };

        this.index = 0;
        this.els = [];

        return directive;
    }

    linkFunc(scope, el) {

        var self = this;

        scope.cells = [];
        self.scope = scope;
        self.timeoutId = null;

        scope.$watchCollection("cells", function(cells) {
            self.updateCells();
        });
        
        window.onresize = function() {
            self.updateCells();
        };

        scope.$watch(el[0].clientHeight, function() {
            self.updateCells();
        });

    }

    updateCells() 
    {
        var self = this;
        clearTimeout(self.timeoutId);

        var maxHeight = 600;

        self.timeoutId = setTimeout(function() {
            self.els = [];
            self.currentIndex = -1;

            angular.forEach(self.scope.cells, function(cell, index) {
                cell.el._index = index;
                if(cell.el.parent().length <= 0) {
                    cell.$destroy();
                    return;
                }

                if(cell.el[0].clientHeight >= maxHeight) {
                    // do overflow action
                    self.addClass(cell.el[0], "overflow");
                }else {
                    self.removeClass(cell.el[0], "overflow");
                }

                self.updateCellSize(cell.el);    
                
            });

            self.scope.$apply();

        });
    }

    updateCellSize(el)
    {
        var self        = this;
        var childWidth  = el[0].clientWidth;
        var childHeight = el[0].clientHeight;
        var parentWidth = el.parent()[0].clientWidth;
        var maxCols     = parseInt( parentWidth / childWidth );

        if(maxCols === 0){ 
            maxCols = 1;
        }

        
        var colHeight = 0;
        var nextColHeight = 0;
        var tolerantHeight = 100;

        var lastIndex = self.currentIndex;

        for (var c = 0; c < maxCols; c++) {

            self.currentIndex += 1;
            if(self.currentIndex >= maxCols) {
                self.currentIndex = 0;
            }

            colHeight     = self.getColHeight(self.currentIndex);
            if(colHeight === 0 || self.getColHeight(lastIndex) >= colHeight) {
                el._colIndex = self.currentIndex;
                if(el._colIndex == maxCols - 1) {
                    self.addClass(el[0], "mostleft");
                }else {
                    self.removeClass(el[0], "mostleft");
                }
                self.els.push(el);
                break;
            }

            lastIndex += 1;
            if(lastIndex >= maxCols) {
                lastIndex = 0;
            }
        }
        
        
        var left = el._colIndex * childWidth;

        el.css("top",colHeight + "px");
        el.css("left", left + "px");
    }

    checkIfRequiredReset()
    {
        var self = this;
        var firstKeyFound = false;
        console.log(self.els.length);
        for (var i = 0; i < self.els.length; i++) {
            if(self.els[i] && self.els[i]._index === 0) {
                firstKeyFound = true;
                break;
            }
        }

        return !firstKeyFound;
    }

    addClass(el, className) {
        if(el.className.indexOf(className) < 0) {
            el.className += " "+className;
        }
    }

    removeClass(el, className) {
        var regex = new RegExp("\s?"+className,"g");
        el.className = el.className.replace(regex,"");
    }

    getColHeight(index)
    {
        var height = 0;
        for (var j = 0; j < this.els.length; j++) {
            if(this.els[j]._colIndex === index) {
                height += this.els[j][0].clientHeight
            }
        }
        return height;   
    }

    getElementsInCol(index) 
    {
        var elsInCol = [];
        for (var j = 0; j < this.els.length; j++) {
            if(this.els[j]._colIndex === index) {
                elsInCol.push(this.els[j]);
            }
        }
        return elsInCol;   
    }

    getElementByIndex(index)
    {
        
        for (var j = 0; j < this.els.length; j++) {
            if(this.els[j]._index === index) {
                return this.els[j];
            }
        }
        return null;
    }
}

export default CellsDirective;