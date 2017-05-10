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