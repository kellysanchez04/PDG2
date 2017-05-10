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
 $scope.actividades = []; 
      
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
        }, function (error) {
          toastr.error("Error al cargar usuarios");
          console.log(error);
        });     
    }

    
    
        var loadCurrentActivity = function(){
      return RowlotService.getCurrentActivity().then(function(response){
        //console.log("user",response)
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
      return RowlotService.getActividades().then(function (response) {          
          console.log("Actividades", response);
          $scope.actividades = response;
        }, function (error) {
          toastr.error("Error al cargar las actividades");
          console.log(error);
   
        });     
    }
    
       $scope.addTitleActividad = function(tareaId, title){                
      var val = angular.element('#'+tareaId).val();      
      var newTitle = parseInt(coins)+parseInt(val);
      RowlotService.updateTitleActividad(tareaId, newTitle);
      angular.element('#'+tareaId).val();
      $scope.actividades = [];
      loadUsers();
      loadCurrentUser();
    }
    
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



    var showActivity = function(visible){         
        return visible=="si";
    }

    var NoShowActivity = function(visible){         
        return visible=="no";
    }

       var showStudent = function(type){         
        return type=="Estudiante";
    }

    var showTeacher = function(type){         
        return type=="Profesor";
    }
    
    var init = function(){
      loadUsers();
      loadCurrentUser();
      //  loadCurrentActivity();
      // loadActividades();
    }();
   
  }
} ());
