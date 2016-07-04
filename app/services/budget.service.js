function budgetService($http) {
    this.getTestApi = function(param) {
        return $http.get('/api').then(
            function(response) {
                return response.data;
            },
            function(response) {
                return "Erreur requete api: " + response;
            });
    };
}

angular
    .module('app')
    .service('budgetService', budgetService);