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

    /**
     * Constructeur
     */
    this.$onInit = function() {
        this.total = 0;
        this.valeurModifiee = 0;
        this.addNew = false;
        this.newEntry = { id: null, type: "", intitule: "", valeur: null };
    };

    /**
     * Initialisation des données d'affichage
     */
    this.$postLink = function() {
        getTotal();
        closeModification();
    };

    // Fonctions du controller dispo dans l'ihm
    /**
     * @param budget L'objet budget
     * @param index Index de l'objet à modifier
     * Initialise le model de l'input d'édition avec le model de l'objet correspondant
     * (permet de ne pas mettre à jour le model this.budget. La mise à jour se fait avec un bouton update)
     * Passe la ligne en mode modification pour faire apparaître l'input
     */
    this.edit = function(budget, index) {
        this.valeurModifiee = this.budget[index].valeur;
        closeModification();
        this.budget[index].enModification = true;
    };
    /**
     * @param valeur La valeur à enregistrer
     * @param index Index de l'objet à modifier
     * Met à jour l'objet avec la nouvelle valeur
     * Passe la modification à false pour cacher l'input
     * Recalcule le total
     */
    this.update = function(valeur, index) {
        this.budget[index].valeur = valeur;
        this.budget[index].enModification = false;
        getTotal();
    };
    /**
     * @param budget L'objet budget
     * @param index Index de l'objet à modifier
     * Supprime la ligne du tableau à l'index donné
     * Recalcule le total
     */
    this.delete = function(budget, index) {
        this.budget.splice(index, 1);
        getTotal();
    };
    /**
     * Crée un objet budget et l'ajoute à this.pudget
     * Recalcule le total
     * Passe addNew à false pour cacher l'input
     */
    this.save = function() {
        this.newEntry.id = this.budget.length + 1;
        this.newEntry.type = this.type;
        this.budget.push(this.newEntry);
        this.newEntry = { id: null, type: "", intitule: "", valeur: null };
        getTotal();
        this.addNew = false;
    };

    // Fonctions privées
    /**
     * Parcourt le tableau budget et met toutes les lignes en modification = false pour cacher les input
     * Ce n'est pas pertinent d'ajouter cet attribut à l'objet directement. On le modifie dynamiquement
     */
    function closeModification() {
        vm.budget.forEach(function(data, index) {
            data.enModification = false;
        });
    };
    /**
     * Calcule totaldes lignes de budget
     */
    function getTotal() {
        var total = 0;
        vm.budget.forEach(function(budget) {
            total += parseInt(budget.valeur, 10);
        });
        vm.total = total;
    };
}

angular
    .module('app')
    .component('budgetBlock', budgetBlock)
    .controller('BlockBudgetController', BlockBudgetController);