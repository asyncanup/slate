define(function (require) {

    return Backbone.View.extend({
        log: console.log.bind(console),
        
        initialize: function (opts) {
            // first extend
            _.extend(this, opts);
            
            // look for subscriptions hash
            this._initSubscriptions();
            
            // finally, run custom setup
            this.setup && this.setup(opts);
        },
        
        _initChildren: function () {
            this._children = {};
            
            _.functions(this.children).forEach(function (childName) {
                var ChildView = this.children[childName],
                    el = this._getElementForChildView(ChildView);
                this._children[childName] = new ChildView({ el: el });
                this._children[childName].render();
            }.bind(this));
            
            _.each(this.children, function (conditional) {
                if (_.isFunction(conditional)) return;
                
                var c = conditional;
                shouldbe("object", c.options);
                shouldbe("object", c.model);
                shouldbe("string", c.property);
                if (_.isString(c.transition)) {
                    c.transition = this[c.transition];
                }
                shouldbe("function", c.transition);
                
                this.listenTo(c.model, "change:" + c.property, this._screenTransition.bind(this, c));
            }.bind(this));
        },
        
        _screenTransition: function (conditional) {
            var c = conditional,
                PrevView = c.model._previousAttributes[c.property],
                CurrentView = c.model.changed[c.property];
            
            shouldbe("function", CurrentView);
            
            var el = this._getElementForChildView(CurrentView);
            if (c._current) c._prev = c._current;
            c._current = new CurrentView({ el: el });
            
            _.each(c.options, function (View, childName) {
                if (View === CurrentView) {
                    this._children[childName] = c._current;
                    return;
                }
            }.bind(this));
            
            function removePrev() {
                shouldbe("object", c._prev);
                
                c._prev.stopListening();
                c._prev.$el.empty().show();
            }
            
            function showCurrent() {
                c._current.render();
            }
            
            c.transition.call(this, c._prev, c._current, removePrev, showCurrent);
        },
        
        _getElementForChildView: function (ChildView) {
            var elSelector = ChildView.prototype.el;
            return _.isString(elSelector) ? this.$(elSelector) : el;
        },
        
        _initSubscriptions: function () {
            // underscore handles the possibility of undefined this.subscriptions
            _.each(this.subscriptions, function (sub, description) {
                if (_.isString(sub.obj)) sub.obj = this[sub.obj];
                shouldbe("object", sub.obj);
                shouldbe("string", sub.event);
                shouldbe("string", sub.callback);
                
                this.listenTo(sub.obj, sub.event, this[sub.callback]);
                this.log && this.log("Subscribed to: " + description);
            }.bind(this));
        },
        
        render: function () {
            if (!this.$el.is(":visible")) {
                this.log("Not rendering, element not visible on screen");
                return this;
            }
            
            if (this.beforeRender && (this.beforeRender() === false)) {
                return this;
            }
        
            this.$el.html(this.template(this.templateData));
            this.log("Rendered");
            
            // initialize declared children
            this._initChildren();
            
            this.afterRender && this.afterRender();

            return this;
        }
    });
});
