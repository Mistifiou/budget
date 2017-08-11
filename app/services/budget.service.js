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
    this.getBudget = function(date){
    	return $http.get('/budget/' + date).then(
                function(response) {
                    return response.data;
                },
                function(response) {
                    return "Erreur requete api: " + response;
                });
    };
    this.getLignesByType = function(type){
    	return $http.get('/budget_lignes/type/' + type).then(
                function(response) {
                    return response.data;
                },
                function(response) {
                    return "Erreur requete api: " + response;
                });
    };
    this.createBudgetLigne = function(ligne) {
    	return $http.post('/budget_lignes/add', ligne).then(
                function(response) {
                    return response.data;
                },
                function(response) {
                    return "Erreur requete api: " + response;
                });
	};
	
	//TODO 
	this.deleteBudgetLigne = function(ligne) {
		console.log("delete budget line | " + ligne);
		return $http.post('/budget_lignes/rm', ligne).then(
                function(response) {
                    return response.data;
                },
                function(response) {
                    return "Erreur requete api: " + response;
                });
	};
	this.updateBudgetLigne = function(ligne) {
		console.log("update budget line | " + ligne);
		return $http.post('/budget_lignes/alter', ligne).then(
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