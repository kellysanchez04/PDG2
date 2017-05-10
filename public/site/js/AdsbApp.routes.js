/**
 * Definición de enrutamientos
 *
 * @author Nelson David Padilla H.
 * @since 3-dic-2016
 *
 */

(function () {
    "use strict";

    angular.module("AdsbApp")
        .config(registerRoutes);

    registerRoutes.$inject = ["$stateProvider", "$urlRouterProvider"];

    function registerRoutes($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .when("/", "dashboard")
            .otherwise("dashboard");

        $stateProvider

            // Login
            .state("login", {
                page_title: "Rowlot - Iniciar Sesión",
                url: "/login",
                templateUrl: "views/login.html",
                controller: "LoginController"
            })
            // Signup
            .state("signup", {
                page_title: "Rowlot - Registro",
                url: "/signup",
                templateUrl: "views/signup.html",
                controller: "LoginController"
            })

            // Authenticated
            .state("auth", {
                abstract: true,
                // this state url
                url: "",
                templateUrl: "views/common/authenticated.html"
            })

            .state("auth.rowlot", {
                page_title: "Rowlot - Dashboard",
                url: "/dashboard",
                templateUrl: "views/rowlot/dashboard.html",
                controller: "RowlotController"
            })
            .state("auth.calendar", {
                page_title: "Rowlot - Calendario",
                url: "/calendar",
                templateUrl: "views/rowlot/calendar.html",
                controller: "RowlotController"
            })
            .state("auth.rowlot-listtask", {
                page_title: "Rowlot - Dashboard",
                url: "/task",
                templateUrl: "views/rowlot/listtask.html",
                controller: "RowlotController"
            })

             .state("auth.rowlot-profile", {
                page_title: "Rowlot - profile",
                url: "/profile",
                templateUrl: "views/rowlot/profile.html",
                controller: "RowlotController"
            })

    };
} ());
