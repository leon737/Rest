define(function(require) {
    const $ = require("jquery");
    const Q = require("q");  
    const _ = require("lodash");
    
    const service = new(function() {
        this.get = url => Q.promise(resolve => 
            $.ajax(url, {
                method: 'GET',
                dataType: 'json'
            })
            .done(data => resolve(_.map(data, v => _.assign({one: () => this.one(url, v.id)}, v)))));

        this.one = (url, id) => Q.promise(resolve => 
            $.ajax(url + '/' + id, {
                method: 'GET'
            })
            .done(data => resolve(data)));
    });

    return service;
});