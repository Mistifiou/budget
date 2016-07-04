var budgetMain = {
    bindings: {},
    controller: BudgetMainController,
    templateUrl: 'components/budget-main/budget.template.html'
};

function BudgetMainController(budgetService) {
    //contructeur
    this.$onInit = function() {
        moment.locale('fr');
        this.displayDate = moment().format('MMMM YYYY');
        this.budget = {
            date: "07-2016",
            revenus: [
                {id: 1, type: "revenus", intitule: "Salaire-net", valeur: 1000},
                {id: 2, type: "revenus", intitule: "CAF-APL", valeur: 400},
                {id: 3, type: "revenus", intitule: "GP", valeur: 200}
            ],
            depensesRegulieres: [
                {id: 1, type: "depensesRegulieres", intitule: "Loyer", valeur: 550},
                {id: 2, type: "depensesRegulieres", intitule: "Essence", valeur: 60}
            ],
            depensesOccasionnelles: [
                {id: 1, type: "depensesOccasionnelles", intitule: "Nourriture", valeur: 150}
            ]
        };
    };
    this.previous = function() {
        this.displayDate = moment(this.displayDate, 'MMMM YYYY').subtract(1, 'M').format('MMMM YYYY');
    };
    this.next = function() {
        this.displayDate = moment(this.displayDate, 'MMMM YYYY').add(1, 'M').format('MMMM YYYY');
    };
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
        return revenusTotal - depensesOccasionnellesTotal - depensesRegulieresTotal;
    };
    this.getApi = function(param) {
        budgetService.getTestApi(param).then(function(data) {
            console.log(data);
        });
    };
}

angular
    .module('app')
    .component('budgetMain', budgetMain)
    .controller('BudgetMainController', BudgetMainController);