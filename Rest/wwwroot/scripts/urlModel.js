define(function(require){
    const _ = require('lodash');

    const urlModel = function(f, restInstance) {
        const model = this;

        let url = '';
        let type = undefined;
        let cache = true;

        model.urlParts = {
            one: undefined,
            all: undefined,            
            dataType: 'json'
        };

        if (f instanceof urlModel) {
            model.baseUrl = f.baseUrl;
            model.urlParts = f.urlParts;            
            model.restInstance = f.restInstance;
        }
        else
            model.baseUrl = f;

        if (!!restInstance)
            model.restInstance = restInstance;        

        model.all = name => {
            setUrlPartsAll(name);
            url = model.urlParts.all;
            type = 'all';
            return model;
        };

        model.one = (name, id) => {
            setUrlPartsAll(name);
            model.urlParts.one = id;
            url = `${model.urlParts.all}/${id}`;
            type = 'one';
            return model;
        };

        model.self = () => {
            url = `${model.urlParts.all}/${model.urlParts.one}`;
            type = 'one';
            return model;
        }

        model.json = () => model.urlParts.dataType = 'json', model;

        model.text = () => (model.urlParts.dataType = 'text', model);

        model.cache = () => (cache = true, model);

        model.noCache = () => (cache = false, model);

        let setUrlPartsAll = name => {
            if (!!name) {
                if (name.startsWith('/')) {
                    model.urlParts.all = name.substring(1);
                    model.baseUrl = '/';
                }
                else
                    model.urlParts.all = name;
            }
        };

        model.getUrl = () => `${model.baseUrl}${model.baseUrl == '/' ? '' : '/'}${url}`;        

        model.getType = () => type;

        model.getDataType = () => model.urlParts.dataType;

        model.getCache = () => cache;

        model.getList = () => model.restInstance.getList(model);

        model.get = () => model.restInstance.get(model);

        model.post = transform => model.restInstance.post(model, transform, model.value);

        model.put = transform => model.restInstance.put(model, transform, model.value);

        model.setValue = value => (model.value = value, model);
    };

    return {
        model: urlModel
    };
});