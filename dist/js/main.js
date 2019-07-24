(function () {
    'use strict';
    
    angular
        .module('main', [
            'ui.router', 
            'ui.bootstrap',
            'ngMask',
            'ngCookies',
            'ngRoute',
            'ngDialog',
            'cr.acl',
            'ui-notification',
            'ngFlash',
            'textAngular',
            'flow',
            'angular-loading-bar',
            'hl.sticky',
            //'stripe.checkout',

            'doll',
            //'watch',
            //'cart',
            //'admin',
            
            'config'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', 'NotificationProvider'];
    function config($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, NotificationProvider) {
        cfpLoadingBarProvider.includeSpinner = false;

        //StripeCheckoutProvider.defaults({
        //    key: STRIPE_KEY
        //});

        NotificationProvider.setOptions({
            startTop: 25,
            startRight: 25,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'bottom'
        });

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            var $location = $injector.get("$location");
            var crAcl = $injector.get("crAcl");

            var state = "";
            
            switch (crAcl.getRole()) {
                //case 'ROLE_ADMIN':
                //    state = 'admin.watches';
                //    break;
                default : state = 'main.doll';
            }

            if (state) $state.go(state);
            else $location.path('/');
        });

        $stateProvider
            .state('main',
                {
                    url: '/',
                    abstract: true,
                    templateUrl: '../views/main.html',
                    controller: 'DollCtrl as doll',
                    //resolve: {
                    //    // checkout.js isn't fetched until this is resolved.
                    //    stripe: StripeCheckoutProvider.load
                    //},
                    data: {
                        is_granted: ['ROLE_GUEST']
                    }
                })
            .state('blog',
                {
                    url: '/blog',
                    templateUrl: '../blog.html'
                });
        //.state('auth', {
        //    url: '/login',
        //    templateUrl: '../views/auth/login.html',
        //    controller: 'AuthCtrl as auth',
        //    onEnter: ['AuthService', 'crAcl', function(AuthService, crAcl) {
        //        AuthService.clearCredentials();
        //        crAcl.setRole();
        //    }],
        //    data: {
        //        is_granted: ['ROLE_GUEST']
        //    }
        //});
    }

    run.$inject = ['$rootScope', '$cookieStore', '$state', 'crAcl'];
    function run($rootScope, $cookieStore, $state, crAcl) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};

        crAcl
            .setInheritanceRoles({
                'ROLE_ADMIN': ['ROLE_ADMIN', 'ROLE_GUEST'],
                'ROLE_GUEST': ['ROLE_GUEST']
            });

        crAcl
            .setRedirect('main.doll');

        if ($rootScope.globals.currentUser) {
            crAcl.setRole($rootScope.globals.currentUser.metadata.role);
            // $state.go('admin.watches');
        }
        else {
            crAcl.setRole();
        }

    }

})();
 
angular.module("config", [])
    .constant("BUCKET_SLUG", "dollfinder-app")
    .constant("MEDIA_URL", "https://api.cosmicjs.com/v1/dollfinder-app/media")
    .constant("URL", "https://api.cosmicjs.com/v1/")
    .constant("READ_KEY", "aunWBeYPX4YRWNcRa92gHSwkZwJE7r4wxQbvjFpuvBTEAvYzkq")
    .constant("WRITE_KEY", "yff8Us81i1Hloe4HS1QJfsyJaiaQ0AUg9OEZhJwEWbfjPq5sUz")
    .constant("STRIPE_KEY", "pk_test_oRv6WcnATRyMqponKKG6QlON");

(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('DollCtrl', DollCtrl);

    function DollCtrl($stateParams, DollService, Notification, $log, MEDIA_URL, $state) {
        var vm = this;

        vm.getDolls = getDolls;
        //vm.removeWatch = removeWatch;

        vm.params = $stateParams;

        vm.categories = [];
        vm.years = [];
        //vm.brands = [];
        //vm.case_sizes = [];
        //vm.colors = [];
        
        vm.dolls = [];
        
        function getDolls() {
            function success(response) {
                $log.info(response);

                vm.dolls = response.data.objects;

            }

            function failed(response) {
                $log.error(response);
            }

            function params(response) {
                response.data.objects.forEach(function (item) {
                    if (vm.categories.indexOf(item.metadata.category) === -1)
                        vm.categories.push(item.metadata.category);
                    //if (vm.brands.indexOf(item.metadata.brand) === -1)
                    //    vm.brands.push(item.metadata.brand);
                    //if (vm.case_sizes.indexOf(item.metadata.case_size) === -1)
                    //    vm.case_sizes.push(item.metadata.case_size);
                    //if (vm.colors.indexOf(item.metadata.color) === -1)
                    //    vm.colors.push(item.metadata.color)
                    if (vm.years.indexOf(item.metadata.year) === -1)
                        vm.years.push(item.metadata.year);
                });
            }

            DollService
                .getDolls($stateParams)
                .then(success, failed);

            DollService
                .getDollsParams()
                .then(params);
        }

        //function removeWatch(slug) {
        //    function success(response) {
        //        $log.info(response);
        //        getWatches();
        //        Notification.success('Removed!');
        //    }

        //    function failed(response) {
        //        $log.error(response);
        //    }
            
        //    WatchService
        //        .removeWatch(slug)
        //        .then(success, failed);

        //}

    }
})();

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
 
(function () {
    'use strict';

    angular
        .module('main')
        .service('DollService', function ($http,
                                          $cookieStore, 
                                          $q, 
                                          $rootScope,
                                          URL, BUCKET_SLUG, READ_KEY, WRITE_KEY, MEDIA_URL) {
            
            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            this.doll = {
                title: null,
                type_slug: 'dolls',
                content: null,
                metafields: [
                    {
                        key: "category",
                        title: "Category",
                        type: "text",
                        value: null
                    },
                    {
                        key: "year",
                        title: "Year",
                        type: "integer",
                        value: null
                    },
                    //{
                    //    key: "brand",
                    //    title: "Brand",
                    //    type: "text",
                    //    value: null
                    //},
                    //{
                    //    key: "case_size",
                    //    title: "Case Size",
                    //    type: "text",
                    //    value: null
                    //},
                    //{
                    //    key: "case_thickness",
                    //    title: "Case Thickness",
                    //    type: "text",
                    //    value: null
                    //},
                    //{
                    //    key: "strap_width",
                    //    title: "Strap Width",
                    //    type: "text",
                    //    value: null
                    //},
                    //{
                    //    key: "movement",
                    //    title: "Movement",
                    //    type: "text",
                    //    value: null
                    //},
                    //{
                    //    key: "glass",
                    //    title: "Glass",
                    //    type: "text",
                    //    value: null
                    //},
                    //{
                    //    key: "water_resistance",
                    //    title: "Water Resistance",
                    //    type: "text",
                    //    value: null
                    //},
                    //{
                    //    key: "color",
                    //    title: "Color",
                    //    type: "text",
                    //    value: null
                    //},
                    //{
                    //    key: "strap_material",
                    //    title: "Strap Material",
                    //    type: "text",
                    //    value: null
                    //},
                    //{
                    //    key: "price",
                    //    title: "Price",
                    //    type: "text",
                    //    value: null
                    //},
                    {
                        key: "images",
                        title: "Images",
                        type: "parent",
                        value: "",
                        children: [
                            {
                                key: "image_1",
                                title: "Image_1",
                                type: "file"
                            }
                            //},
                            //{
                            //    key: "image_2",
                            //    title: "Image_2",
                            //    type: "file"
                            //},
                            //{
                            //    key: "image_3",
                            //    title: "Image_3",
                            //    type: "file"
                            //}
                        ]
                    }
                ]
            };

            this.getDolls = function (params) {
                if (!angular.equals({}, params))
                    return $http.get(URL + BUCKET_SLUG + '/object-type/dolls/search', {
                        params: {
                            metafield_key: params.key,
                            metafield_value: params.value,
                            limit: 100,
                            read_key: READ_KEY
                        }
                    });
                else
                    return $http.get(URL + BUCKET_SLUG + '/object-type/dolls', {
                        params: {
                            limit: 100,
                            read_key: READ_KEY
                        }
                    });
            };
            this.getDollsParams = function () {
                return $http.get(URL + BUCKET_SLUG + '/object-type/dolls', {
                    params: {
                        limit: 100,
                        read_key: READ_KEY
                    }
                });
            };
            this.getDollBySlug = function (slug) {
                return $http.get(URL + BUCKET_SLUG + '/object/' + slug, {
                    params: {
                        read_key: READ_KEY
                    }
                });
            };
            //this.updateWatch = function (event) {
            //    event.write_key = WRITE_KEY;

            //    return $http.put(URL + BUCKET_SLUG + '/edit-object', event);
            //};
            //this.removeWatch = function (slug) {
            //    return $http.delete(URL + BUCKET_SLUG + '/' + slug, {
            //        ignoreLoadingBar: true,
            //        headers:{
            //            'Content-Type': 'application/json'
            //        },
            //        data: {
            //            write_key: WRITE_KEY
            //        }
            //    });
            //};
            //this.createWatch = function (watch) {
            //    watch.write_key = WRITE_KEY;
                
            //    return $http.post(URL + BUCKET_SLUG + '/add-object', watch);
            //};
            //this.upload = function (file) {
            //    var fd = new FormData();

            //    fd.append('media', file);
            //    fd.append('write_key', WRITE_KEY);

            //    var defer = $q.defer();

            //    var xhttp = new XMLHttpRequest();

            //    xhttp.upload.addEventListener("progress",function (e) {
            //        defer.notify(parseInt(e.loaded * 100 / e.total));
            //    });
            //    xhttp.upload.addEventListener("error",function (e) {
            //        defer.reject(e);
            //    });

            //    xhttp.onreadystatechange = function() {
            //        if (xhttp.readyState === 4) {
            //            defer.resolve(JSON.parse(xhttp.response)); //Outputs a DOMString by default
            //        }
            //    };

            //    xhttp.open("post", MEDIA_URL, true);

            //    xhttp.send(fd);
                
            //    return defer.promise;
            //}
        });
})();  
(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('DollProfileCtrl', DollProfileCtrl);

    function DollProfileCtrl(UserService, $stateParams, DollService, Notification, $log, MEDIA_URL, $state) {
        var vm = this;

        vm.getDoll = getDoll;

        function getDoll() {
            function success(response) {
                $log.info(response);
                vm.doll = response.data.object;
            }

            function failed(response) {
                $log.error(response);
            }

            DollService
                .getDollBySlug($stateParams.slug)
                .then(success, failed);
        }

    }
})();

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
 