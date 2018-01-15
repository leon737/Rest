define(function(require){

    const ko = require('ko');
    const rest = require('rest');    
    require('restObservable');

    const model = new(function() {
        const model = this;

        model.elements = ko.observableArray([]);
        model.info = ko.observable();
        model.hasInfo = ko.computed(() => !!model.info());
        model.selectedId = ko.observable();

        model.load = e => e.rest().one().text().get().then(result => model.info.set(result));

        model.loadById = () => model.elements.rest().one(model.selectedId()).text().get().then(result => model.info.set(result));

        model.update = (e) => !!e.rest ? e.rest().put() : model.info.rest().put(v => ({value: v}));

        rest.all('/api/values').noCache().get().then(result => model.elements.set(result));
        
    });

    ko.applyBindings(model);

});