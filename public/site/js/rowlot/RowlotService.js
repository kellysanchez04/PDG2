/**
 * Servicio para el manejo de la lógica de negocio del módulo de aviones
 *
 * @author Nelson D. Padilla
 * @since 3-dic-2016
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
                firebase.database().ref('/Actividad/' + activity.uid).once('value').then(function(snapshot) {
                  //var username = snapshot.val().username;                  
                  defered.resolve(snapshot.val());
                  // ...
                })            
            }
            return promise;
        }
        
                 var getActividades = function () {
            var defered = $q.defer();
            var promise = defered.promise;
            let actividades = [];            
            //acceso al servicio bd
            let database = firebase.database();
         
                 //Mi nodo de Actividades
            let ref = database.ref('Actividad');
                ref.on('value', function (ss) {
                //let nombre = ss.val();
                let tareas = ss.val();                
                //tengo las keys de las tareas en un array
                let keys = Object.keys(tareas);      
                for (let i = 0; i < keys.length; i++){
                    let k = keys [i];                    
                    actividades.push({"dataActividad": tareas[k], "uid": k});
                }                
                defered.resolve(actividades);
            })

            return promise;
        }
                 
                 
                 
                var updateTitleActividad = function(tareaId, title){
            var tareaRef = firebase.database().ref('/Actividad/' + tareaId);
            tareaRef.update({
              Titulo: title
                //log.console(title);
            });
        }         
        
        

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
           //getCurrentActivity:getCurrentActivity,
            getCurrentUser: getCurrentUser,
            getActividades: getActividades,
            updateCoins:updateCoins,
            updateMedalla: updateMedalla,
            updateVida: updateVida,
            updateTitleActividad: updateTitleActividad
        }
    }
} ());
