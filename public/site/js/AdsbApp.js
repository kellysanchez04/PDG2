/**
 * Creaci�n del m�dulo principal del aplicativo
 * 
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function () {
    'use strict';

    angular.module("AdsbApp",
        ["ngTouch",
         "toastr",
         "firebase",
         "ui.router",
         "ngCookies",
         "ngAnimate",
         'oc.lazyLoad',
         "ui.bootstrap",
         "ngMessages",
         "ngMaterial",
         "ncy-angular-breadcrumb",
         "uiGmapgoogle-maps",
         "vAccordion",
         "angular-loading-bar"
        ]);
}());
