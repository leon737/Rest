define(function(require) {
    const ko = require('ko');
    const _ = require('lodash');

    ko.observable.fn.rest = function() {
        for (let propName in this.urlModel) {
            if (propName == "__post" || propName == "__put")
            {
                this.urlModel[propName.substring(2)] = transform => this.urlModel[propName](ko.toJSON(this), transform);                    
            }
        }
        console.log(this.urlModel);
        return this.urlModel;
    }
        
    ko.observable.fn.set = function(data) {
        this(data.value);
        this.urlModel = data.url;
    }

    ko.observableArray.fn.set = function(data) {
        let mapped = _.map(data.list, v => {
            let observableValue = ko.observable();
            observableValue.set(v);            
            return observableValue;
        });
        this(mapped);
        this.urlModel = data.url;
    }

});