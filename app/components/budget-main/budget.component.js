var budgetMain = {
    bindings: {},
    controller: BudgetMainController,
    templateUrl: 'components/budget-main/budget.template.html'
};

function BudgetMainController() {
    //contructeur
    this.$onInit = function() {
        moment.locale('fr');
        this.displayDate = moment().format('MMMM YYYY');
    };
    this.previous = function() {
        this.displayDate = moment(this.displayDate, 'MMMM YYYY').subtract(1, 'M').format('MMMM YYYY');
    };
    this.next = function() {
        this.displayDate = moment(this.displayDate, 'MMMM YYYY').add(1, 'M').format('MMMM YYYY');
    };
}

angular
    .module('app')
    .component('budgetMain', budgetMain)
    .controller('BudgetMainController', BudgetMainController);