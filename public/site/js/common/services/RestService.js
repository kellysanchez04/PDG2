/**
 * Servicio para el manejo de las operaciones REST
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function () {
    'use strict';

    angular
        .module('AdsbApp')
        .service('RestService', RestService);

    RestService.$inject = ['$http', '$q', 'BaseUri'];

    function RestService($http, $q, BaseUri, LoginBaseUri) {

        // Servicio post
        var post = function (path, data) {
            return $q.resolve($http({
                method: 'POST',
                url: BaseUri.url + path,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            }));
        };

        // Servicio get
        var get = function (path) {          
            return $q.resolve($http.get(BaseUri.url + path));
        };

        // Servicio login
        var login = function (path, body) {
            // todo: puede falta la adición de un config
            return $q.resolve($http.post(BaseUri.url + path, body));
        };

        return {
            post: post,
            get: get,
            login: login
        }
    }
})();
