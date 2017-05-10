/**
 * Configuración del run
 * 
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function () {
    'use strict';
    
    
    angular.module('AdsbApp')
           .run(runBlock);

    runBlock.$inject = ['$log', '$stateParams', '$rootScope', '$cookieStore', '$location', '$state', 'CurrentUserService', "LoginRedirectService"];


    function runBlock($log, $stateParams, $rootScope, $cookieStore, $location, $state, CurrentUserService, LoginRedirectService) {

        $rootScope.location = $location;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeSuccess', function () {
            // scroll view to top
            $("html, body").animate({ scrollTop: 0 }, 200);
        });

       $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
            // Se adiciona la lógica para comprobar que puedo mostrar si no estoy logueado
            var user = CurrentUserService.profile;

            if (!user.loggedIn && toState.name != "login" && toState.name != "signup") {                            
                e.preventDefault();
                LoginRedirectService.redirectPostLogout();                
            }

            if (user.loggedIn && toState.name == "login") {
                e.preventDefault();
                LoginRedirectService.redirectPostLogin();
            }
        })            
    };
})();