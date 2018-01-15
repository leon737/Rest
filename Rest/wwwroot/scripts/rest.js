define(function(require) {
    const $ = require("jquery");
    const Q = require("q");  
    const _ = require("lodash");
    const urlModel = require("urlModel");

    let makeRestCall = params => 
        $.ajax(params.url, {
                method: params.method,
                dataType: params.dataType,
                cache: params.cache,
                data: params.data
            });

    let makeGetRestCall = model => makeRestCall({
        url: model.getUrl(), 
        method: 'GET', 
        dataType: model.getDataType(), 
        cache: model.getCache()});

    let makePostPutRestCall = (model, verb, transform, value) => makeRestCall({
        url: model.getUrl(),
        method: verb,
        cache: 'false',
        data: !!transform ? transform(value) : value
        });

    const service = new(function() {
        const serviceInstance = this;

        this.all = url => new urlModel.model('', serviceInstance).all(url);
        this.one = (url, id) => new urlModel.model('', serviceInstance).one(url, id);
        
        let getList = model => Q.promise(resolve => 
            makeGetRestCall(model)
            .done(data => {
                let seq = {obj: {}, list: data, url: model};
                seq = _.flow([expandSequence, expandElements])(seq);
                seq.obj.list = seq.list;
                return resolve(seq.obj);
        }));

        let get = model => Q.promise(resolve => 
            makeGetRestCall(model)            
            .done(data => resolve(expandElement({data: data, url: model}).data)));

        let post = (model, tranform, value) => Q.promise(resolve => 
            makePostPutRestCall(model, 'POST', transform, value)
            .done(result => resolve(result)));

        let put = (model, transform, value) => Q.promise(resolve => 
            makePostPutRestCall(model, 'PUT', transform, value)
            .done(result => resolve(result)));

        this.get = model => model.getType() == 'all' ? getList(model) : get(model);

        this.post = post;

        this.put = put;           

    });

    let expandSequence = function(p) {
        let obj = p.obj;
        const list = p.list;
        const url = p.url;
        obj.url = {};
        obj.url = addOne(url, obj.url);        
        return {obj: obj, list: list, url: url};
    };

    let expandElement = function(p) {
        let data = p.data;
        const url = p.url;
        data = {value: data, url: {}};
        data.url = addAll(url, data.url);
        data.url = addPost(url, data.url);
        data.url = addPut(url, data.url);
        return {data: data, url: url};
    };

    let expandElements = function(p) {
        const obj = p.obj;
        const url = p.url;
        let list = p.list;
        list = _(list)
            .map(v => ({value: v, url: {}}))
            .map(v => (v.url = addAll(url, v.url), v))
            .map(v => (v.url = addOne(url, v.url, v.value.id), v))
            .map(v => (v.url = addPost(url, v.url, v.value.id), v))
            .map(v => (v.url = addPut(url, v.url, v.value.id), v))
            .value();
        return {obj: obj, list: list, url: url};
    }

    let addOne = function(url, element, id) {
        return _.assign({one: !!id 
            ? () => new urlModel.model(url).one('', id)
            : id => new urlModel.model(url).one('', id)  }, element);
    }

    let addAll = function(url, element) {
        return  _.assign({all: () => new urlModel.model(url).all()}, element);
    }

    let addPost = function(url, element, id) {
         return  _.assign({__post: value => !!id 
            ? new urlModel.model(url).one('', id).setValue(value).post() 
            : new urlModel.model(url).self().setValue(value).post()}, element);
     }

    let addPut = function(url, element, id) {
         return  _.assign({__put: (value, transform) => !!id 
            ? new urlModel.model(url).one('', id).setValue(value).put(transform) 
            : new urlModel.model(url).self().setValue(value).put(transform)}, element);
    }

    return service;
});