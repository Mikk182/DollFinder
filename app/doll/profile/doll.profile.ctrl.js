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
