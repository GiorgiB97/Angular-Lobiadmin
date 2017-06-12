(function () {
  'use strict';

  angular
    .module('app.notes')
    .controller('NotesController', NotesControllerFn);

  /** @ngInject */
  function NotesControllerFn($scope, $http, $translate, Notes) {
    var vm = this;

    // Data
    vm.notes = Notes.data;

    // Methods
    vm.addNote = addNote;
    vm.editNote = editNote;
    vm.deleteNote = deleteNote;
    vm.archiveNote = archiveNote;

    init();

    ///////////

    function init() {
      // $scope.$watch("vm.notes", function () {});
    }

    function addNote() {
      console.log("Add new note");
    }

    function editNote(id) {
      console.log("Edit note ", id);

    }

    function deleteNote(id) {
      $translate(['NOTES.DELETE_TITLE', 'NOTES.DELETE_MSG', 'NOTES.DELETE_YES', 'NOTES.DELETE_NO']).then(function (translations) {
        var del = Lobibox.confirm({
          title: translations['NOTES.DELETE_TITLE'],
          msg: translations['NOTES.DELETE_MSG']+vm.notes[id].title+"' ?",
          buttons: {
            yes: {
              text: translations['NOTES.DELETE_YES']
            },
            no: {
              text: translations['NOTES.DELETE_NO']
            }
          },
          callback: function ($this, type, ev) {
            if(type === "yes"){
              if(id > -1) {
                vm.notes.splice(id,1);
                $scope.$apply();
              }
            }
          }
        });
        del.show();
      });
    }

    function archiveNote(id) {
      console.log("Archive note ", id);
    }

  }
})();
