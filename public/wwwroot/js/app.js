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

/**
 * Configuración de las librerías utilizadas
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function () {
    "use strict";

    angular.module("AdsbApp")
        .config(configInterceptors)         
        .config(configLoader);

    configInterceptors.$inject = ["$httpProvider"];

    // Interceptors
    function configInterceptors($httpProvider) {
        // configuramos los interceptors
        $httpProvider.interceptors.push("AddTokenService");
        $httpProvider.interceptors.push("LoginRedirectService");
    }


    configLoader.$inject = ['cfpLoadingBarProvider'];

    function configLoader(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.parentSelector = "#loading-bar-spinner-container";
    }

})();

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
            page_title: "Rowlot - Profile",
            url: "/profile",
            templateUrl: "views/rowlot/profile.html",
            controller: "RowlotController"
        })

            .state("auth.rowlot-biblioteca", {
            page_title: "Rowlot - Library",
            url: "/library",
            templateUrl: "views/rowlot/biblioteca.html",
            controller: "RowlotController"
        })



    };
} ());

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
/**
 * Controller de la página de autenticación (Login)
 * 
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function () {
    "use strict";

    angular.module("AdsbApp")
        .controller("LoginController", LoginController);

    LoginController.$inject = ["$scope", "$rootScope",  "LoginService", "CurrentUserService", "LoginRedirectService", "toastr"];

    function LoginController($scope, $rootScope,  LoginService, CurrentUserService, LoginRedirectService, toastr) {

        $scope.credentials = {
            username: "",
            password: ""
        }

        // Instancia del usuario actual
        $scope.user = CurrentUserService.profile;

        // Inicio de sesión
        $scope.login = function (form) {
            if (form.$valid) {
                LoginService.login($scope.credentials)
                    .then(function (response) {

                    LoginRedirectService.redirectPostLogin();

                }, function (error) {

                    toastr.error("No se pudo ejecutar la operación");
                    console.log(error);

                });

                $scope.credentials.password = "";
                form.$setUntouched();
            }
        }
        //Registro
        $scope.signup = function(form){
            if (form.$valid){
                console.log($scope.credentials);
                LoginService.signup($scope.credentials).then(function(response){
                    LoginRedirectService.redirectPostLogin();
                }, function(error){
                    toastr.error("No se pudo ejecutar la operación");
                    console.log(error);
                });
                $scope.credentials.password = "";
                form.$setUntouched();
            }
        }
        // Cierre de sesión - Se eliminan datos del usuario y se redirecciona a la página de login
        $scope.logout = function () {            
            firebase.auth().signOut().then(function() {
                LoginService.logout();
                LoginRedirectService.redirectPostLogout();
            }, function(error) {
                // An error happened.
            });
        }

        var init = function(){  
            // Row Toggler
            // -----------------------------------------------------------------
            $('#demo-foo-row-toggler').footable();

            // Accordion
            // -----------------------------------------------------------------
            $('#demo-foo-accordion').footable().on('footable_row_expanded', function(e) {
                $('#demo-foo-accordion tbody tr.footable-detail-show').not(e.row).each(function() {
                    $('#demo-foo-accordion').data('footable').toggleDetail(this);
                });
            });

            // Pagination
            // -----------------------------------------------------------------
            $('#demo-foo-pagination').footable();
            $('#demo-show-entries').change(function (e) {
                e.preventDefault();
                var pageSize = $(this).val();
                $('#demo-foo-pagination').data('page-size', pageSize);
                $('#demo-foo-pagination').trigger('footable_initialized');
            });

            // Filtering
            // -----------------------------------------------------------------
            var filtering = $('#demo-foo-filtering');
            filtering.footable().on('footable_filtering', function (e) {
                var selected = $('#demo-foo-filter-status').find(':selected').val();
                e.filter += (e.filter && e.filter.length > 0) ? ' ' + selected : selected;
                e.clear = !e.filter;
            });

            // Filter status
            $('#demo-foo-filter-status').change(function (e) {
                e.preventDefault();
                filtering.trigger('footable_filter', {filter: $(this).val()});
            });

            // Search input
            $('#demo-foo-search').on('input', function (e) {
                e.preventDefault();
                filtering.trigger('footable_filter', {filter: $(this).val()});
            });


            // Search input
            $('#demo-input-search2').on('input', function (e) {
                e.preventDefault();
                addrow.trigger('footable_filter', {filter: $(this).val()});
            });

            // Add & Remove Row
            var addrow = $('#demo-foo-addrow');
            addrow.footable().on('click', '.delete-row-btn', function() {

                //get the footable object
                var footable = addrow.data('footable');

                //get the row we are wanting to delete
                var row = $(this).parents('tr:first');

                //delete the row
                footable.removeRow(row);
            });
            // Add Row Button
            $('#demo-btn-addrow').click(function() {

                //get the footable object
                var footable = addrow.data('footable');

                //build up the row we are wanting to add
                var newRow = '<tr><td>thome</td><td>Woldt</td><td>Airline Transport Pilot</td><td>3 Oct 2016</td><td><span class="label label-table label-success">Active</span></td><td><button type="button" class="btn btn-sm btn-icon btn-pure btn-outline delete-row-btn" data-toggle="tooltip" data-original-title="Delete"><i class="ti-close" aria-hidden="true"></i></button></td></tr>';

                //add it
                footable.appendRow(newRow);
            });


        }();
    }

}());
/**
 * Servicio para el manejo de la lógica de negocio del módulo de autenticación
 * 
 * @author Nelson David Padilla
 * @since 3-dic-2016
 *
 */

(function () {
    'use strict';

    angular.module("AdsbApp")
        .service("LoginService", LoginService);

    LoginService.$inject = ['RestService', 'CurrentUserService', '$q', "$firebaseAuth"];

    function LoginService(RestService, CurrentUserService, $q, $firebaseAuth) {

        // Servicio de inicio de sesión        
        var login = function (credentials) {

            var defered = $q.defer();
            var promise = defered.promise;

            const auth = firebase.auth();

            //Sign In
            auth.signInWithEmailAndPassword(credentials.username, credentials.password).catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;                
                // ...
            });

            // Add a realtime listener
            firebase.auth().onAuthStateChanged(function(user) {
                if(user) {                    
                    CurrentUserService.setProfile(credentials.username, user.uid);
                    defered.resolve();
                }else{
                    console.error("Authentication failed:", error);
                    defered.reject("Usuario no existe...")    
                }
            });
            return promise;
        }
        var signup = function(credentials){
            var defered = $q.defer();
            var promise = defered.promise;

            const auth = firebase.auth();

            auth.createUserWithEmailAndPassword(credentials.email,credentials.password).then(function(user){
                if(user){
                    console.log('uid',user.uid);                  
                    writeUserData(user.uid,credentials.email, credentials.password,'imagencita', credentials.name, credentials.lastName, credentials.type);                      
                    defered.resolve();
                }else{
                    console.error("Authentication failed:", error);
                    defered.reject("Usuario no existe...") 
                }
            });
            return promise;
        }
        //Funcion donde agrego los datos del usuario creado
        //a la base de datos, con el UID <3
        var writeUserData = function (userId, email, pass, imageUrl, nombre, apellido, type) {
            console.log('basededatos');
            firebase.database().ref('Usuarios/' + userId).set({
                Nombre: nombre,
                Apellido: apellido,
                email: email,
                Contrasena: pass,
                profile_picture : imageUrl,
                experiencia: 0,
                Moneda: 300,
                Medalla: 0,
                Tipo: type,
                Vida: 5

            });
        }
        // Servicio de fin de sesión
        var logout = function () {
            // Elimina el perfil almacenado
            CurrentUserService.removeProfile();
        }

        return {
            login: login,
            logout: logout,
            signup: signup
        };
    };

})();
/**
 * Controller for draw in GoogleMapApi
 *
 * @author Nelson D. Padilla
 * @since 17-dic-2016
 *
 */

(function () {
    "use strict";

    angular.module("AdsbApp")
        .controller("RowlotController", RowlotController);

    RowlotController.$inject = ['$scope', '$timeout', 'RowlotService',"CurrentUserService","toastr"];

    function RowlotController($scope, $timeout,  RowlotService, CurrentUserService, toastr) { 
        
        $scope.users = [];
        $scope.profile = [];    
        $scope.unidades = []; 

        var loadCurrentUser = function(){
            return RowlotService.getCurrentUser().then(function(response){
                //console.log("user",response)
                $scope.profile = response;
                console.log("TIPO", $scope.profile.Tipo);
                var typeStudent = showStudent($scope.profile.Tipo);
                $scope.showStudent = typeStudent;
                var typeTeacher = showTeacher($scope.profile.Tipo);
                $scope.showTeacher = typeTeacher;
                //console.log("SHOW", type);
            }, function (error) {
                toastr.error("Error al cargar usuario");
                console.log(error);
            });
        }

        var loadUsers = function(){
            return RowlotService.getUsers().then(function (response) {          
                //    console.log("Users", response);
                $scope.users = response;
                console.log("ENTRO ACTIVIDAD",$scope.users);
               // console.log("SCOPE USERS",$scope.users);
            }, function (error) {
                toastr.error("Error al cargar usuarios");
                console.log(error);
            });     
        }


      
        var loadCurrentActivity = function(){
            return RowlotService.getCurrentActivity().then(function(response){
               // console.log("aaaaaa",response)
                $scope.tarea = response;
                console.log("VISIBLE", $scope.tarea.Visible);
                var visibleSi = showActivity($scope.tarea.Visible);
                $scope.showActivity = visibleSi;
                var visibleNo = NoShowActivity($scope.tarea.Visible);
                $scope.NoShowActivity = visibleNo;
                console.log("SHOW", visible);
            }, function (error) {
                toastr.error("Error al cargar usuario");
                console.log(error);
            });
        }

        var loadActividades = function(){
            return RowlotService.getUnidades().then(function (response) {          
               // console.log("Actividades", response);
                $scope.unidades = response;
               // console.log("ENTRO ACTIVIDAD",$scope.unidades);
            }, function (error) {
                toastr.error("Error al cargar las unidades");
                console.log(error);

            });     
        }
  /*
        $scope.addTitleActividad = function(tareaId, title){
            console.log("Actividades");
            var val = angular.element('#'+tareaId).val();      
            var newTitle = parseInt(coins)+parseInt(val);
            RowlotService.updateTitleActividad(tareaId, newTitle);
            angular.element('#'+tareaId).val();
            $scope.unidades = [];
            loadUsers();
            loadCurrentUser();
        }
        */

        $scope.addCoins = function(userId, coins){                
            var val = angular.element('#'+userId).val();      
            var newCoins = parseInt(coins)+parseInt(val);
            RowlotService.updateCoins(userId, newCoins);
            angular.element('#'+userId).val();
            $scope.users = [];
            loadUsers();
            loadCurrentUser();
        }

        $scope.substratCoins = function(userId, coins){            
            var val = angular.element('#'+userId).val();      
            var newCoins = parseInt(coins)-parseInt(val);
            RowlotService.updateCoins(userId, newCoins);
            angular.element('#'+userId).val();
            $scope.users = [];
            loadUsers();
            loadCurrentUser();
        }

        $scope.addMedalla = function(userId, metal){        
            var val = angular.element('#metal-'+userId).val();      
            var newMedalla = parseInt(metal)+parseInt(val);      
            RowlotService.updateMedalla(userId, newMedalla);
            angular.element('#'+userId).val();
            $scope.users = [];
            loadUsers();
            loadCurrentUser();
        }

        $scope.substratMedalla = function(userId, coins){            
            var val = angular.element('#metal-'+userId).val();      
            var newMedalla = parseInt(coins)-parseInt(val);
            RowlotService.updateMedalla(userId, newMedalla);
            angular.element('#'+userId).val();
            $scope.users = [];
            loadUsers();
            loadCurrentUser();
        }


        $scope.addVida = function(userId, life){        
            var val = angular.element('#life-'+userId).val();      
            var newVida = parseInt(life)+parseInt(val);      
            RowlotService.updateVida(userId, newVida);
            angular.element('#'+userId).val();
            $scope.users = [];
            loadUsers();
            loadCurrentUser();
        }

        $scope.substratVida = function(userId, life){            
            var val = angular.element('#life-'+userId).val();      
            var newVida = parseInt(life)-parseInt(val);
            RowlotService.updateVida(userId, newVida);
            angular.element('#'+userId).val();
            $scope.users = [];
            loadUsers();
            loadCurrentUser();
        }



        /* var showActivity = function(visible){         
            return visible=="si";
        }


        var NoShowActivity = function(visible){         
            return visible=="no";
        }
        */

        var showStudent = function(type){         
            return type=="Estudiante";
        }

        var showTeacher = function(type){         
            return type=="Profesor";
        }

        var init = function(){
            loadUsers();
            loadCurrentUser();
            loadCurrentActivity();
            loadActividades();
        }();

    }
} ());

/**
 * 
 *
 */

(function () {
    'use strict';

    angular
        .module('AdsbApp')
        .service('RowlotService', RowlotService);

    RowlotService.$inject = ['RestService','$q'];

    function RowlotService(RestService, $q) {

        var getCurrentUser = function(){
            var defered = $q.defer();
            var promise = defered.promise;
            let user = firebase.auth().currentUser;            
            if(user != null){            
                firebase.database().ref('/Usuarios/' + user.uid).once('value').then(function(snapshot) {
                    //var username = snapshot.val().username;                  
                    defered.resolve(snapshot.val());
                    // ...
                })            
            }
            return promise;
        }

        var getUsers = function () {
            var defered = $q.defer();
            var promise = defered.promise;
            let users = [];            
            //acceso al servicio bd
            let database = firebase.database();
            //Mi nodo de Usuarios
            let ref = database.ref('Usuarios');
            ref.on('value', function (ss) {
                //let nombre = ss.val();
                let nombres = ss.val();                
                //tengo las keys de los usuarios en un array
                let keys = Object.keys(nombres);      
                for (let i = 0; i < keys.length; i++){
                    let k = keys [i];                    
                    users.push({"data": nombres[k], "uid": k});
                }                
                defered.resolve(users);
            })

            return promise;
        }



        var getCurrentActivity = function(){

            var defered = $q.defer();
            var promise = defered.promise;
            let activity = firebase.auth().currentActivity;            
            if(activity != null){            
                firebase.database().ref('/Unidad/' + activity.uid).once('value').then(function(snapshot) {
                    //var username = snapshot.val().username;                  
                    defered.resolve(snapshot.val());
                    // ...
                })            
            }
            return promise;
        }

        var getUnidades = function () {

            var defered = $q.defer();
            var promise = defered.promise;
            let unidades = [];            
            //acceso al servicio bd
            let database = firebase.database();

            //Mi nodo de Actividades
            let ref = database.ref('Unidad');
            ref.on('value', function (ss) {
                //let nombre = ss.val();
                let tareas = ss.val();                
                //tengo las keys de las ACTIVIDADES en un array
                let keys = Object.keys(tareas);      
                for (let i = 0; i < keys.length; i++){
                    let k = keys [i];                    
                    unidades.push({"data": tareas[k], "uid": k});
                }                
                defered.resolve(unidades);
            })

            return promise;
        }        


/*
        var updateTitleActividad = function(tareaId, title){

            var tareaRef = firebase.database().ref('/Actividad/' + tareaId);
            tareaRef.update({
                Titulo: title
                //log.console(title);
            });
        }         
*/


        var updateCoins = function(userId, coins){
            var userRef = firebase.database().ref('/Usuarios/' + userId);
            userRef.update({
                Moneda: coins
            });
        }


        var updateMedalla = function(userId, metal){
            var userRef = firebase.database().ref('/Usuarios/' + userId);
            userRef.update({
                Medalla: metal
            });
        } 

        var updateVida = function(userId, life){
            var userRef = firebase.database().ref('/Usuarios/' + userId);
            userRef.update({
                Vida: life
            });
        } 

        return {
            getUsers: getUsers,
            getCurrentUser: getCurrentUser,

           getCurrentActivity:getCurrentActivity,
            getUnidades: getUnidades,


            updateCoins:updateCoins,
            updateMedalla: updateMedalla,
            updateVida: updateVida,
           // updateTitleActividad: updateTitleActividad
        }
    }
} ());

/*UNIDADES*/



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
(function () {
    "use strict";

    angular.module("AdsbApp")
        .controller("SideMenuController", SideMenuController);


    SideMenuController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "$timeout"];

    function SideMenuController($rootScope, $scope, $state, $stateParams, $timeout) {

        $scope.sections = [
            {
                id: 0,
                title: "Dashboard",
                icon: "mdi mdi-table fa-fw",                
                link: "auth.rowlot-dasboarh"
            },
            {
                id: 1,
                title: "Ranking",
                icon: "mdi mdi-table fa-fw",
                link: "auth.rowlow-listtask"
            },
            {
                id: 2,
                title: "Tareas",
                icon: "mdi mdi-table fa-fw",                
                submenu: [
                    {
                        title: "KRDU",
                        link: "auth.aircraft-livetraffic-01"
                    },
                    {
                        title: "KLZU",
                        link: "auth.aircraft-livetraffic-02"
                    }
                ]
            },
            {
                id: 3,
                title: "NMACs",
                icon: "fa fa-paper-plane-o first_level_icon",
                link: "auth.aircraft-nmacs"
            },

        ];

        // accordion menu
        $(document).off("click", ".side_menu_expanded #main_menu .has_submenu > a").on("click", ".side_menu_expanded #main_menu .has_submenu > a", function () {
            if ($(this).parent(".has_submenu").hasClass("first_level")) {
                var $this_parent = $(this).parent(".has_submenu"),
                    panel_active = $this_parent.hasClass("section_active");

                if (!panel_active) {
                    $this_parent.siblings().removeClass("section_active").children("ul").slideUp("200");
                    $this_parent.addClass("section_active").children("ul").slideDown("200");
                } else {
                    $this_parent.removeClass("section_active").children("ul").slideUp("200");
                }
            } else {
                var $submenu_parent = $(this).parent(".has_submenu"),
                    submenu_active = $submenu_parent.hasClass("submenu_active");

                if (!submenu_active) {
                    $submenu_parent.siblings().removeClass("submenu_active").children("ul").slideUp("200");
                    $submenu_parent.addClass("submenu_active").children("ul").slideDown("200");
                } else {
                    $submenu_parent.removeClass("submenu_active").children("ul").slideUp("200");
                }
            }
        });

        $rootScope.createScrollbar = function () {
            $("#main_menu .menu_wrapper").mCustomScrollbar({
                theme: "minimal-dark",
                scrollbarPosition: "outside"
            });
        };

        $rootScope.destroyScrollbar = function () {
            $("#main_menu .menu_wrapper").mCustomScrollbar("destroy");
        };

        $timeout(function () {
            if (!$rootScope.sideNavCollapsed && !$rootScope.topMenuAct) {
                if (!$("#main_menu .has_submenu").hasClass("section_active")) {
                    $("#main_menu .has_submenu .act_nav").closest(".has_submenu").children("a").click();
                } else {
                    $("#main_menu .has_submenu.section_active").children("ul").show();
                }
                // init scrollbar
                $rootScope.createScrollbar();
            }
        });


    }
})();

(function () {
    "use strict";

    angular
        .module("AdsbApp")
    /* Directives */

    // change page title
        .directive('updateTitle', [
        '$rootScope',
        function ($rootScope) {
            return {
                link: function (scope, element) {
                    var listener = function (event, toState, toParams, fromState, fromParams) {
                        var title = 'Yukon Admin';
                        if (toState.page_title) {
                            title = toState.page_title;
                        }
                        if ($rootScope.appVer) {
                            element.text(title + ' (' + $rootScope.appVer + ')');
                        } else {
                            element.text(title);
                        }
                    };
                    $rootScope.$on('$stateChangeStart', listener);
                }
            }
        }
    ])
    // page preloader
        .directive('pageLoader', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'AE',
                template: '<div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div>',
                link: function (scope, el, attrs) {
                    el.addClass('pageLoader hide');
                    scope.$on('$stateChangeStart', function (event) {
                        el.toggleClass('hide animate');
                    });
                    scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                        event.targetScope.$watch('$viewContentLoaded', function () {
                            $timeout(function () {
                                el.toggleClass('hide animate')
                            }, 600);
                        })
                    });
                }
            };
        }
    ])
    // show/hide side menu
        .directive('menuToggle', [
        '$rootScope',
        '$cookieStore',
        '$window',
        '$timeout',
        function ($rootScope, $cookieStore, $window, $timeout) {
            return {
                restrict: 'E',
                template: '<span class="menu_toggle" ng-click="toggleSidebar()"><span class="icon_menu_toggle" ><i class="arrow_carrot-2left" ng-class="sideNavCollapsed ? \'hide\' : \'\'"></i><i class="arrow_carrot-2right" ng-class="sideNavCollapsed ? \'\' : \'hide\'"></i></span></span>',
                link: function (scope, el, attrs) {
                    var mobileView = 992;
                    $rootScope.getWidth = function () {
                        return window.innerWidth;
                    };
                    $rootScope.$watch($rootScope.getWidth, function (newValue, oldValue) {
                        if (newValue >= mobileView) {
                            if (angular.isDefined($cookieStore.get('sideNavCollapsed'))) {
                                if ($cookieStore.get('sideNavCollapsed') == false) {
                                    $rootScope.sideNavCollapsed = false;
                                } else {
                                    $rootScope.sideNavCollapsed = true;
                                }
                            } else {
                                $rootScope.sideNavCollapsed = false;
                            }
                        } else {
                            $rootScope.sideNavCollapsed = true;
                        }
                        $timeout(function () {
                            $(window).resize();
                        });
                    });
                    scope.toggleSidebar = function () {
                        $rootScope.sideNavCollapsed = !$rootScope.sideNavCollapsed;
                        $cookieStore.put('sideNavCollapsed', $rootScope.sideNavCollapsed);
                        if (!$rootScope.fixedLayout) {
                            if (window.innerWidth > 991) {
                                $timeout(function () {
                                    $(window).resize();
                                });
                            }
                        }
                        if (!$rootScope.sideNavCollapsed && !$rootScope.topMenuAct) {
                            $rootScope.createScrollbar();
                        } else {
                            $rootScope.destroyScrollbar();
                        }
                    };
                }
            };
        }
    ])
    // update datatables fixedHeader position
        .directive('updateFixedHeaders', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getElDimensions = function () {
                return {
                    'w': element.width(),
                    'h': element.height()
                };
            };
            scope.$watch(scope.getElDimensions, function (newValue, oldValue) {
                if (typeof oFH != 'undefined') {
                    oFH._fnUpdateClones(true);
                    oFH._fnUpdatePositions();
                }
            }, true);
            w.bind('resize', function () {
                scope.$apply();
            });
        };
    })
    // ng-repeat after render callback
        .directive('onLastRepeat', function ($timeout) {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $timeout(function () {
                    scope.$emit('onRepeatLast', element, attrs);
                })
            }
        };
    })
    // add width/height properities to Image
        .directive('addImageProp', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                elem.on('load', function () {
                    var w = !scope.isHighDensity() ? $(this).width() : $(this).width() / 2,
                        h = !scope.isHighDensity() ? $(this).height() : $(this).height() / 2;
                    $(this).attr('width', w).attr('height', h);
                });
            }
        };
    })


})();
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
/**
 * Servicio para interactual con los mapas de google
 *
 * @author Nelson D. Padilla and David E. Morales
 * @since 17-dic-2016
 *
 */

(function () {
    "use strict";

    angular
        .module('AdsbApp')
        .service('GoogleMapService', GoogleMapService);

    GoogleMapService.$inject = [];

    function GoogleMapService() {

        var drawPath = function (path) {

            var collection = [];
            var coord1, coord2;
            for (var i = 1; i < path.length; i++) {
                if (path[i] != null && (path[i].msgtype == 3 ||  path[i].msgtype == 2)) {
                    coord1 = path[i];
                }
                if (path[i - 1] != null && (path[i - 1].msgtype == 3 || path[i - 1].msgtype == 2)) {
                    coord2 = path[i - 1];
                }
                var step = [coord2, coord1];
                var color = altitudeColor(path[i].altitude);
                var draw = drawStep(step, color, false);
                collection.push(draw);
            }

            var airplaneIcon = {
                icon: planeSymbol,
                offset: '100%'
            }
            collection[collection.length - 1].icons.push(airplaneIcon);

            return collection;
        }

        var drawStep = function (step, color, drawIcon) {
            return {
                path: step,
                stroke: {
                    color: color,
                    weight: 5
                },
                geodesic: true,
                visible: true,
                icons: []
            }
        }

        var planeSymbol = {
            path: 'M362.985,430.724l-10.248,51.234l62.332,57.969l-3.293,26.145 l-71.345-23.599l-2.001,13.069l-2.057-13.529l-71.278,22.928l-5.762-23.984l64.097-59.271l-8.913-51.359l0.858-114.43 l-21.945-11.338l-189.358,88.76l-1.18-32.262l213.344-180.08l0.875-107.436l7.973-32.005l7.642-12.054l7.377-3.958l9.238,3.65 l6.367,14.925l7.369,30.363v106.375l211.592,182.082l-1.496,32.247l-188.479-90.61l-21.616,10.087l-0.094,115.684',
            scale: 0.0633, 
            strokeOpacity: 1,
            color: 'black',
            strokeWeight: 0,
            fillColor: '#000',
            fillOpacity: 1
        }

        var drawMarkers = function (type, markers, time) {
            var collection = [];
            for (var i = 0; i < markers.length; i++) {
                if (markers.length > 1 && markers[i + 1] != null) {
                    var now = moment(markers[i + 1].gentime);
                    var end = moment(markers[i].gentime);
                    var duration = moment.duration(now.diff(end));
                    if (duration.asSeconds() >= time) {
                        collection.push(createMarker(i, type, markers[i]));
                    }
                } else {
                    collection.push(createMarker(i, type, markers[i]));
                }
            }
            return collection;
        }

        var createMarker = function (i, type, point) {
            var ret = {
                id: i,
                latitude: point.latitude,
                longitude: point.longitude,
                alert: point.alert,
                icon: iconType(type)
            };

            return ret;
        }

        var iconType = function (type) {

            if (type == "gndspd") {
                return 'content/images/speed.png';
            } else if (type == "vspd") {
                return 'content/images/caution.png';
            } else if (type == "emerg") {
                return 'content/images/flag.png';
            } else if (type == "sqwk") {
                return 'content/images/radiotower.png';
            }
        }

        var altitudeColor = function (altitude) {

            if (altitude >= 0 && altitude <= 499)
                return '#FF0000';
            else if (altitude >= 500 && altitude <= 999)
                return '#FF6600';
            else if (altitude >= 1000 && altitude <= 1999)
                return '#CC9900';
            else if (altitude >= 2000 && altitude <= 2999)
                return '#FFCC00';
            else if (altitude >= 3000 && altitude <= 4999)
                return '#00CC00';
            else if (altitude >= 5000 && altitude <= 7499)
                return '#0033FF';
            else if (altitude >= 7500 && altitude <= 10000)
                return '#9900CC';
            else
                return '#000';
        }

        var fitMap = function (map, polylines) {
            var bounds = new google.maps.LatLngBounds();
            var firtsStep = new google.maps.LatLng(findFirstPoint(polylines).latitude,
                                                   findFirstPoint(polylines).longitude);
            var lastStep = new google.maps.LatLng(findLastPoint(polylines).latitude,
                                                  findLastPoint(polylines).longitude);

            bounds.extend(firtsStep);
            bounds.extend(lastStep);
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        }

        var findFirstPoint = function (polylines) {
            for (var i = 0; i < polylines.length; i++) {
                var path = polylines[i].path[0];
                if (path.latitude != undefined && path.longitude) {
                    return {
                        latitude: path.latitude,
                        longitude: path.longitude
                    }
                }
            }
        }

        var findLastPoint = function (polylines) {
            for (var i = polylines.length - 1; i > 0; i--) {
                var path = polylines[i].path[0];
                if (path.latitude != undefined && path.longitude) {
                    return {
                        latitude: path.latitude,
                        longitude: path.longitude
                    }
                }
            }
        }

        return {
            drawPath: drawPath,
            drawMarkers: drawMarkers,
            fitMap: fitMap
        }
    }
} ());

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



(function () {
    'use strict';
    angular
        .module('AdsbApp')
    // .service('RestService', RestService);

        .controller('AppCtrl', function($scope) {
        $scope.users = ['Fabio', 'Leonardo', 'Thomas', 'Gabriele', 'Fabrizio', 'John', 'Luis', 'Kate', 'Max'];
    });


})();






