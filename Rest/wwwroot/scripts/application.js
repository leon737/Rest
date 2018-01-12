define(function(require){

    const ko = require('ko');
    const rest = require('rest');

    const model = new(function() {
        const model = this;

        model.elements = ko.observableArray([]);
        model.info = ko.observable();
        model.hasInfo = ko.computed(() => !!model.info());

        model.load = e => e.one().then(result => model.info(result));

        rest.get('/api/values').then(result => model.elements(result));        
        
    });

    ko.applyBindings(model);

});