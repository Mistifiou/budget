/**
 * @param $http Service http d'angular
 * Fait une requête GET vers la route correspondante à l'API définie dans le routing d'express
 */
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