(function () {
  'use strict';

  angular
    .module('app.notes')
    .controller('NotesController', NotesControllerFn);

  /** @ngInject */
  function NotesControllerFn($scope, $http, $uibModal, $translate, Notes) {
    var vm = this;

    // Data
    vm.pinnedNotes = [];
    vm.notes = [];
    vm.searchValue = "";

    // Methods
    vm.addNote = addNote;
    vm.editNote = editNote;
    vm.deleteNote = deleteNote;
    vm.archiveNote = archiveNote;
    vm.pinNote = pinNote;

    init();

    ///////////

    function init() {
      for (var i = 0; i < Notes.data.length; i++) {
        if (Notes.data[i].pinned === true) {
          vm.pinnedNotes.push(Notes.data[i]);
        } else {
          vm.notes.push(Notes.data[i]);
        }
      }
    }

    function addNote() {
      console.log("Add new note");
    }

    function editNote(note, index) {
      $uibModal.open({
        templateUrl: 'app/main/apps/notes/dialogs/edit-note/edit-note.html',
        controller: 'EditNoteController',
        controllerAs: 'vm',
        size: 'md',
        resolve: {
          Note: note
        }
      }).result.then(function (ret) {
        if (note.pinned) {
          vm.pinnedNotes[index] = ret.editedNote;
        } else {
          vm.notes[index] = ret.editedNote;
        }
      }, function () {
      });
    }

    function deleteNote($event, note, index) {
      $event.stopPropagation();
      $translate(['NOTES.DELETE_TITLE', 'NOTES.DELETE_MSG', 'NOTES.DELETE_YES', 'NOTES.DELETE_NO']).then(function (translations) {
        var del = Lobibox.confirm({
          title: translations['NOTES.DELETE_TITLE'],
          msg: translations['NOTES.DELETE_MSG'] + note.title + "' ?",
          buttons: {
            yes: {
              text: translations['NOTES.DELETE_YES']
            },
            no: {
              text: translations['NOTES.DELETE_NO']
            }
          },
          callback: function ($this, type, ev) {
            if (type === "yes") {
              if (note.pinned) {
                vm.pinnedNotes.splice(index, 1);
              } else {
                vm.notes.splice(index, 1);
              }
              $scope.$apply();
            }
          }
        });
        del.show();
      });
    }

    function archiveNote(note, index) {
      console.log("Archive note ", index);
    }

    function pinNote(note, index) {
      if (note.pinned === true) {
        note.pinned = false;
        vm.notes.push(note);
        vm.pinnedNotes.splice(index, 1);
      } else {
        note.pinned = true;
        vm.notes.splice(index, 1);
        vm.pinnedNotes.push(note);
      }
    }

  }
})();
