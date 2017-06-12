(function () {
  'use strict';

  angular
    .module('app.notes', [])
    .config(Config);

  /** @ngInject */
  function Config($stateProvider, $translateProvider, $translatePartialLoaderProvider, lobiNavigationServiceProvider) {
    $translateProvider.useLoader('$translatePartialLoader',{
      urlTemplate: '{part}/i18n/{lang}.json'
    });
    $translateProvider.preferredLanguage('en');
    // $translateProvider.useSanitizeValueStrategy('sanitize');
    // Translation
    $translatePartialLoaderProvider.addPart('app/main/apps/notes');

    $stateProvider
      .state('app.notes', {
        url: '/notes',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/notes/notes.html',
            controller: 'NotesController as vm',
            resolve: {
              Notes: function ($http) {
                return $http.get('app/main/apps/notes/data/notes.json')
                  .then(function (response) {
                    return response.data;
                  }, function (error) {
                    return 'There was an error getting data' + error;
                  });
              }
            }
          }
        },
        bodyClass: 'app-notes'
      })
    ;

    lobiNavigationServiceProvider.saveItem('app.notes', {
      text: 'Notes',
      state: 'app.notes',
      weight: 1,
      icon: 'fa fa-sticky-note'
    });
  }
})();
