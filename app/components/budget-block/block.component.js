var budgetBlock = {
    transclude: true,
    bindings: {
        type: '@',
        budget: '='
    },
    controller: BlockBudgetController,
    templateUrl: 'components/budget-block/block.template.html'
};

function BlockBudgetController() {

    var vm = this;

    //contructeur
    this.$onInit = function() {
        this.total = 0;
        this.valeurModifiee = 0;
        this.addNew = false;
        this.newEntry = { id: null, type: "", intitule: "", valeur: null };
    };

    //initialisation données
    this.$postLink = function() {
        this.total = getTotal(this.budget);
        closeModification();
    };

    //fonctions
    this.edit = function(budget, index) {
        this.valeurModifiee = this.budget[index].valeur;
        closeModification();
        this.budget[index].enModification = true;
    };
    this.update = function(valeur, index) {
        this.budget[index].valeur = valeur;
        this.budget[index].enModification = false;
        this.total = getTotal(this.budget);
    };
    this.delete = function(budget, index) {
        this.budget.splice(index, 1);
        this.total = getTotal(this.budget);
    };
    this.save = function() {
        this.newEntry.id = this.budget.length + 1;
        this.newEntry.type = this.type;
        this.budget.push(this.newEntry);
        this.newEntry = { id: null, type: "", intitule: "", valeur: null };
        this.total = getTotal(this.budget);
        this.addNew = false;
    };
    function closeModification() {
        vm.budget.forEach(function(data, index) {
            data.enModification = false;
        });
    };
    function getTotal(budgets) {
        var total = 0;
        budgets.forEach( function(budget) {
            total += parseInt(budget.valeur, 10);
        });
        return total;
    };
}

angular
    .module('app')
    .component('budgetBlock', budgetBlock)
    .controller('BlockBudgetController', BlockBudgetController);