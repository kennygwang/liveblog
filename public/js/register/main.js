/**
 * This file contains signup form logic.
 */

angular.module('signup', [])
    .controller('RegisterController', ['$scope', '$http', function ($scope, $http){

        $scope.user = {name: 'hiii'};
        $scope.submitMessage = 'Sign up';
        $scope.stateClass = '';
        $scope.disableSubmit = false;
        console.log($scope)

        $scope.register = function (e){
            // e.preventDefault();

            // $http.post('/api/users', $scope.user)
            $http.post('/register', $scope.user)
                .success(function (data){
                    $scope.submitMessage = 'Account created!';
                    $scope.stateClass = 'success';
                    $scope.disableSubmit = true;
                    
                    setTimeout(function (){
                        window.location.href = '/login';
                    }, 2000);

                }).error(function (e){
                    $scope.submitMessage = 'Errors!  Try again.';
                    $scope.stateClass = 'alert';

                });
        };
    }]);

// $('#signup-form').submit();
