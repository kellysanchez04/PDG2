/**
 * Servicio para el manejo de los datos del usuario autenticado
 * 
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function () {
    'use strict';

    angular.module("AdsbApp")
           .factory("CurrentUserService", CurrentUserService);

    CurrentUserService.$inject = ['LocalStorageService'];

    function CurrentUserService(LocalStorageService) {

        var USERKEY = "utoken";

        // Persiste los datos del perfil del usuario
        var setProfile = function (username, token) {
            profile.username = username;
            profile.token = token;
            // Almacena la información del token
            LocalStorageService.add(USERKEY, profile);
        };

        // Remueve los permisos del perfil del usuario
        var removeProfile = function () {
            profile.username = "";
            profile.token = "";
            // Elimina la información del token
            LocalStorageService.remove(USERKEY);
        };

        // Inicializa los datos del perfil del usuario
        var initialize = function () {

            var user = {
                username: "",
                token: "",
                get loggedIn() {
                    return this.token != "";
                }
            }
            // Si existe un usuario almacenado se recupera
            var localUser = LocalStorageService.get(USERKEY);
            if (localUser) {
                user.username = localUser.username;
                user.token = localUser.token;
            }

            return user;
        };

        var profile = initialize();

        return {
            removeProfile: removeProfile,
            setProfile: setProfile,
            profile: profile
        }
    }

})();