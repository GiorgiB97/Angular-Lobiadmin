(function () {
  'use strict';

  angular
    .module('app.notes', [])
    .config(Config);

  /** @ngInject */
  function Config($stateProvider, lobiNavigationServiceProvider) {

    $stateProvider
      .state('app.notes', {
        url: '/notes',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/notes/notes.html',
            controller: 'NotesController as vm'
          }
        },
        bodyClass: 'app-notes'
      })
    ;

    lobiNavigationServiceProvider.saveItem('app.notes', {
      text: 'Notes',
      state: 'app.notes',
      weight: 1
    });
  }
})();
