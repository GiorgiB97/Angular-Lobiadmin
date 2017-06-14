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
    vm.noteStyles = ["style-note-primary", "style-note-success", "style-note-danger", "style-note-info", "style-note-warning", "style-note-gray", "style-note-cyan", "style-note-purple", "style-note-pink"];

    // Methods
    vm.ok = ok;
    vm.cancel = cancel;

    init();

    function init() {

    }

    function ok() {
      // @todo This code should be tested
      console.log(vm.note);
      $uibModalInstance.close({
        editedNote: vm.note
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
