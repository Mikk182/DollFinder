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
