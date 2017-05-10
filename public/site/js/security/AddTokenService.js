/**
 * Servicio para el manejo del token de seguridad en las peticiones http
 * 
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function () {
    'use strict';

    angular.module("AdsbApp")
           .service("AddTokenService", AddTokenService);

    AddTokenService.$inject = ['$q', 'CurrentUserService'];

    function AddTokenService($q, CurrentUserService) {

        // Intercepta la petición
        var request = function (config) {
            // Si el usuario está loggueado adiciono el token
            if (CurrentUserService.profile.loggedIn) {
                config.headers.Authorization = CurrentUserService.profile.token;
            }
            return $q.when(config);
        }

        return {
            request: request
        }
    }
})();