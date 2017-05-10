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