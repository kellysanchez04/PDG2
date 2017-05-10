/**
 * Servicio para el manejo de las operaciones de almacenamiento en el storage
 * 
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function () {
    "use strict";

    angular.module("AdsbApp")
           .service("LocalStorageService", LocalStorageService);

    LocalStorageService.$inject = ["$window"];

    function LocalStorageService($window) {

        // Se selecciona el servicio de almacenamiento
        var store = $window.localStorage;
        var prefix = "AdsbApp_";

        // Adiciona una nueva variable
        var add = function (key, value) {
            value = angular.toJson(value);
            store.setItem(key, value);
        }

        // Obtiene una variable
        var get = function (key) {
            var value = store.getItem(key);

            if (value) {
                value = angular.fromJson(value);
            }

            return value;
        }

        // Elimina una variable
        var remove = function (key) {
            store.removeItem(key);
        }

        return {
            add: add,
            get: get,
            remove: remove
        }
    }

})();