(function () {
    'use strict';
    
    angular
        .module('doll.profile', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('main.doll.profile', {
                url: 'dolls/:slug',
                views: {
                    '@main': {
                        templateUrl: '../views/doll/doll.profile.html',
                        controller: 'DollProfileCtrl as vm'
                    }
                }
            });
    }
    
})();
 