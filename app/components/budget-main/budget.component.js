var budgetMain = {
	bindings : {},
	controller : BudgetMainController,
	templateUrl : 'components/budget-main/budget.template.html'
};

function BudgetMainController(budgetService) {

    var vm = this;
    this.loadedBudgets = [];
	this.budget = {date: "00 0000", revenus: [],  depensesRegulieres:[], depensesOccasionnelles:[]};
	
	/**
	 * Constructeur
	 */
	this.$onInit = function() {
		// locales pour moment
		moment.locale('fr');
		this.displayDate = moment().format('MMMM YYYY');

		console.log("init budget main controller");
		this.initBudget();
		
		console.log("loaded budget = " + this.budget);
	};

	this.ligneTypes = {
		0 : "revenus",
		1 : "depensesRegulieres",
		2 : "depensesOccasionnelles"
	};

	this.initBudget = function() {
		var db_date = moment(this.displayDate, 'MMMM YYYY').format("YYYY-MM-01");
		
		this.getBudget(db_date);
	}

	// Fonctions du controller dispo dans l'ihm
	/**
	 * Choisit la date précédente - 1 mois
	 */
	this.previous = function() {
		this.displayDate = moment(this.displayDate, 'MMMM YYYY').subtract(1,
				'M').format('MMMM YYYY');
		this.initBudget();
	};
	/**
	 * Choisit la date suivante + 1 mois
	 */
	this.next = function() {
		this.displayDate = moment(this.displayDate, 'MMMM YYYY').add(1, 'M')
				.format('MMMM YYYY');
		this.initBudget();
	};
	/**
	 * Calcule le budget restant pour le mios en cours Revenus - dépenses
	 */
	this.getReste = function() {
		var revenusTotal = 0;
		var depensesOccasionnellesTotal = 0;
		var depensesRegulieresTotal = 0;
		this.budget.revenus.forEach(function(data) {
			revenusTotal += parseInt(data.valeur, 10);
		})
		this.budget.depensesRegulieres.forEach(function(data) {
			depensesRegulieresTotal += parseInt(data.valeur, 10);
		})
		this.budget.depensesOccasionnelles.forEach(function(data) {
			depensesOccasionnellesTotal += parseInt(data.valeur, 10);
		})
		return revenusTotal - depensesOccasionnellesTotal
				- depensesRegulieresTotal;
	};

	/**
	 * Test. Fonction temporaire qui appelle le service pour requêter la base de
	 * données.
	 */
	this.getApi = function(param) {
		budgetService.getTestApi(param).then(function(data) {
			console.log(data);
		});
	};

	/**
	 * CRUD
	 */
	this.getBudget = function(date_i) {
		console.log("loaded budgets : " + vm.loadedBudgets);
		if(vm.loadedBudgets[date_i] != null){
			console.log("already loaded, instanciate with loading");
			vm.budget = vm.loadedBudgets[date_i];
		}
		
		console.log("get budget for date | " + date_i);
		//var db_date = moment(date_i).format("YYYY-MM-DD");

		// recherche un budget en DB fonction de la date
		budgetService.getBudget(date_i).then(function(data) {
			if(data.length == 0){
				// si ret = empty on initialise avec les dépenses régulières
				budgetService.getLignesByType(1).then(function(data){
					if(data.length == 0){
						console.log("init budget with test data");
						// si ret des dépenses regul est vide on initialise le jeu d'essai
						
						var budget_test = [ 
							{type: 0, intitule: "Salaire-net", valeur: 1000, date:date_i}, 
							{type: 0, intitule: "CAF-APL", valeur: 400, date:date_i}, 
							{type: 0, intitule: "GP", valeur: 200, date:date_i},
							{type: 1, intitule: "Loyer", valeur: 550, date:date_i},
							{type: 1, intitule: "Essence", valeur: 60, date:date_i},
							{type: 2, intitule: "Nourriture", valeur: 150, date:date_i}]
						
						budget_test.forEach(function(data) {
							budgetService.createBudgetLigne(data);
						})
						vm.initBudgetWithDatas(budget_test, date_i);	
						
					}else{
						console.log("initialise budget with constant cost");
						data.forEach(function(data) {
							data.date = date_i;
							data.id = null;
							budgetService.createBudgetLigne(data);
						})
						vm.initBudgetWithDatas(data, date_i);
					}
				});
			}else{		
				console.log("loading existing budget");
				vm.initBudgetWithDatas(data, date_i);
			}
		});
	};
	
	this.initBudgetWithDatas = function(rows, date_i){
		console.log("init object with datas" + rows);
		
		var budget = {date: date_i, revenus: [],  depensesRegulieres:[], depensesOccasionnelles:[]};
		
		rows.forEach(function(data){
			var type = vm.ligneTypes[data.type];			
			budget[type].push(data)
		})
		
		vm.budget = budget;
		vm.loadedBudgets[date_i] = budget;
	};
}

angular.module('app').component('budgetMain', budgetMain).controller(
		'BudgetMainController', BudgetMainController);

/* Exemple
 * var current = { date: this.displayDate, revenus: [ {id: 1, type:
 * "revenus", intitule: "Salaire-net", valeur: 1000}, {id: 2, type:
 * "revenus", intitule: "CAF-APL", valeur: 400}, {id: 3, type:
 * "revenus", intitule: "GP", valeur: 200} ], depensesRegulieres: [ {id:
 * 1, type: "depensesRegulieres", intitule: "Loyer", valeur: 550}, {id:
 * 2, type: "depensesRegulieres", intitule: "Essence", valeur: 60} ],
 * depensesOccasionnelles: [ {id: 1, type: "depensesOccasionnelles",
 * intitule: "Nourriture", valeur: 150} ] };
 */