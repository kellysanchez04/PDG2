/**
 * Servicio para el manejo de las ventanas de dialogo
 * 
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function () {
    'use strict';

    angular.module('AdsbApp')
           .service('DialogService', DialogService);

    DialogService.$inject = ['$mdDialog', '$http'];

    
    function DialogService($mdDialog, $http) {

        // Despliega un confirm popup
        var confirm = function (titulo, mensaje) {

            var confirm = $mdDialog.confirm()
                                   .title(titulo)
                                   .content(mensaje)
                                   .ariaLabel('Confirmación de usuario')
                                   .ok('Si')
                                   .cancel('No')
                                   .hasBackdrop(true);

            return $mdDialog.show(confirm);

        }

        // Despliega un alert popup
        var alert = function (mensaje) {
            $mdDialog.show($mdDialog.alert()
                               .title('')
                               .content(mensaje)
                               .ok('Aceptar')
                               .hasBackdrop(true)
                    );
        }

        return {
            confirm: confirm,
            alert: alert
        }
    }
})();