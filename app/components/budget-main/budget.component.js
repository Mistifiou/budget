var budgetMain = {
    bindings: {},
    controller: BudgetMainController,
    templateUrl: 'components/budget-main/budget.template.html'
};

function BudgetMainController(budgetService) {
    /**
     * Constructeur
     */
    this.$onInit = function() {
        //locales pour moment
        moment.locale('fr');
        this.displayDate = moment().format('MMMM YYYY');
        //Initilisation statique des données (TODO: depuis DB)
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

    // Fonctions du controller dispo dans l'ihm
    /**
     * Choisit la date précédente - 1 mois
     */
    this.previous = function() {
        this.displayDate = moment(this.displayDate, 'MMMM YYYY').subtract(1, 'M').format('MMMM YYYY');
    };
    /**
     * Choisit la date suivante + 1 mois
     */
    this.next = function() {
        this.displayDate = moment(this.displayDate, 'MMMM YYYY').add(1, 'M').format('MMMM YYYY');
    };
    /**
     * Calcule le budget restant pour le mios en cours
     * Revenus - dépenses
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
        return revenusTotal - depensesOccasionnellesTotal - depensesRegulieresTotal;
    };
    /**
     * Test. Fonction temporaire qui appelle le service pour requêter la base de données.
     */
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