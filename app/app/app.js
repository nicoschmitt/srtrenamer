(function() {
    var app = angular.module('myApp', [ 'ngRoute', "ngMaterial", "ngDroplet" ]);
    
    const { version } = require("./package.json");
    document.title += " - " + version;

    app.config(['$routeProvider',
        function ($routeProvider) {

            $routeProvider.when("/", {
                templateUrl: "./app/views/home.html",
                controller: "homeCtrl",
                controllerAs: "vm"

            }).otherwise({ redirectTo: "/" });

        }
    ]);
   
}());