var budgetBlock = {
    transclude: true,
    bindings: {
        type: '@'
    },
    controller: BlockBudgetController,
    templateUrl: 'components/budget-block/block.template.html'
};

function BlockBudgetController(budgetService) {

    var vm = this;

    //contructeur
    this.$onInit = function() {
        this.total = 0;
        this.valeurModifiee = 0;
        this.addNew = false;
        this.newEntry = { id: null, type: "", intitule: "", valeur: null };
        this.blockData = [];
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

    //initialisation données
    this.$postLink = function() {
        if(this.type === "revenus") {
            this.blockData = this.budget.revenus;
           updateTotal("revenus");
        }
        else if(this.type === "depensesRegulieres") {
            this.blockData = this.budget.depensesRegulieres;
            updateTotal("depensesRegulieres");
        }
        else {
            this.blockData = this.budget.depensesOccasionnelles;
            updateTotal("depensesOccasionnelles");
        }
        closeModification();
    };

    //fonctions
    this.edit = function(budget, index) {
        this.valeurModifiee = this.blockData[index].valeur;
        closeModification();
        this.blockData[index].enModification = true;
    };
    this.update = function(valeur, index) {
        this.blockData[index].valeur = valeur;
        this.blockData[index].enModification = false;
        if(this.blockData[index].type === "revenus")
            updateTotal("revenus");
        else if(this.blockData[index].type === "depensesRegulieres")
            updateTotal("depensesRegulieres");
        else
            updateTotal("depensesOccasionnelles");
    };
    this.delete = function(budget, index) {
        if(budget.type === "revenus") {
            this.budget.revenus.splice(index, 1);
            updateTotal("revenus");
        }
        else if(budget.type === "depensesRegulieres") {
            this.budget.depensesRegulieres.splice(index, 1);
            updateTotal("depensesRegulieres");
        }
        else {
            this.budget.depensesOccasionnelles.splice(index, 1);
            updateTotal("depensesOccasionnelles");
        }
    };
    this.save = function() {
        this.newEntry.id = this.blockData.length + 1;
        this.newEntry.type = this.blockData[0].type;
        this.blockData.push(this.newEntry);
        this.newEntry = { id: null, type: "", intitule: "", valeur: null };
        updateTotal(this.blockData[0].type);
        this.addNew = false;
    };
    this.getApi = function(param) {
        budgetService.getTestApi(param).then(function(data) {
            console.log(data);
        });
    };
    function closeModification() {
        vm.blockData.forEach(function(data, index) {
            data.enModification = false;
        });
    };
    function updateTotal(type) {
        if(type === "revenus")
            vm.total = getTotal(vm.budget.revenus);
        if(type === "depensesRegulieres")
            vm.total = getTotal(vm.budget.depensesRegulieres);
        if(type === "depensesOccasionnelles")
            vm.total = getTotal(vm.budget.depensesOccasionnelles);
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