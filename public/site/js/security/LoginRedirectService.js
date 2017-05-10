/**
 * Servicio para el manejo de los redireccionamientos según el estado del token de autenticación del usuario
 * 
 * @author Nelson David Padilla
 * @since 31-Mar-2017
 *
 */

(function () {
    "use strict";

    angular.module("AdsbApp")
           .service("LoginRedirectService", LoginRedirectService);

    LoginRedirectService.$inject = ["$q", "$injector", "$location"];

    function LoginRedirectService($q, $injector, $location) {

        var main = "auth.rowlot";
        var lastPath = main;

        // Intercepta los errores por expiración de permisos y redirecciona a la página de logueo
        var responseError = function (response) {
            if (response.status == 401 || response.status == 403) {
                lastPath = $location.path();
                $injector.get("$state").go("login");
            }
            return $q.reject(response);
        }

        // Almacena la última dirección 
        var redirectPostLogin = function () {
            // Redirije a la última dirección almacenada
            $injector.get("$state").go(lastPath);
            lastPath = main;
        }
        
        // Redirecciona a la página de login
        var redirectPostLogout = function () {
            $injector.get("$state").go("login"); 
            lastPath = main;
        }
        // Redirecciona a la página de login
        var redirectPostSignup = function () {
            $injector.get("$state").go("signup"); 
            lastPath = main;
        }
        // Determina si se está en la página de logueo
        var isLoginPath = function () {
            if ($injector.get("$state").is("login"))
                return true;
            return false;
        }

        return {
            responseError: responseError,
            redirectPostLogin: redirectPostLogin,
            redirectPostLogout: redirectPostLogout,
            isLoginPath: isLoginPath
        }
    }
})();