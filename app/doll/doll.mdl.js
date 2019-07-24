(function () {
    'use strict';
    
    angular
        .module('doll', [
            'doll.profile'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('main.doll', {
                url: '?key&value',
                templateUrl: '../views/doll/doll.list.html',
                controller: 'DollCtrl as vm'
            });
    }
})();
 