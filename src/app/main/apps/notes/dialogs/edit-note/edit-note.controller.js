/**
 * Created by george on 6/13/17.
 */
(function () {
  'use strict';

  angular
    .module('app.notes')
    .controller('EditNoteController', EditNoteControllerFn);

  /** @ngInject */
  function EditNoteControllerFn($uibModalInstance, Note) {
    var vm = this;
    // variables
    vm.note = angular.copy(Note);
    vm.noteStyles = ["primary", "success", "danger", "info", "warning", "gray", "cyan", "purple", "pink"];

    // Methods
    vm.ok = ok;
    vm.cancel = cancel;

    init();

    function init() {

    }

    function ok() {
      // @todo This code should be tested
      $uibModalInstance.close({
        editedNote: vm.note
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
