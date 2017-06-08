(function () {
  'use strict';

  angular
    .module('app.fileManager')
    .controller('FileManagerController', FileManagerControllerFn);

  /** @ngInject */
  function FileManagerControllerFn($scope, $rootScope, $translate, $uibModal, $log, $state, omAside, files, Files) {
    var vm = this;

    // vm.selectedCategory = files;

    vm.files = files.fileList;
    vm.breadcrumbs = files.breadcrumbs;

    vm.selectedFile = null;
    vm.selectedFiles = [];

    vm.currentView = 'list-condensed';
    vm.orderByField = 'name';
    vm.defaultSort = true;
    vm.filterBy = "";

    vm.menuOptions = [];

    vm.searchValue = "";
    // vm.searchResults = [];

    vm.canPreview = ["Image", "Video", "Audio"];
    vm.users = [
      {"name": "John Doe", "email": "JohnDoe@example.com"},
      {"name": "Jane Doe", "email": "JaneDoe@examle.com"},
      {"name": "user name", "email": "userEmail@example.com"}
    ];
    vm.currentUser = vm.users[0];
    vm.isOffCanvasMenuOpened = false;
    vm.allSelected = false;

    // Methods

    // File Display
    vm.toggleView = toggleView;

    // File Directory
    vm.switchDirectory = switchDirectory;

    // File Selections
    vm.selectFile = selectFile;
    vm.selectMultiple = selectMultiple;
    vm.selectAll = selectAll;
    vm.deleteSelectedFolders = deleteSelectedFolders;

    // File Type Check
    vm.checkFileType = checkFileType;
    // Upload Buttons
    vm.chooseFiles = chooseFiles;
    vm.chooseFolder = chooseFolder;
    // Create/Rename Folder Modal
    vm.showCreateFolderDialog = showCreateFolderDialog;

    // Menu actions
    vm.menuItemClick = menuItemClick;

    vm.filterListByTag = filterListByTag;
    vm.toggleAside = toggleAside;
    vm.changeDirectory = changeDirectory;

    /////////////////////////

    translateMenu();
    init();

    function init() {
      var languageChange = $rootScope.$on('App:languageChange', function () {
        translateMenu();
      });

      $rootScope.$on('destroy', languageChange)
    }

    function toggleView() {
      if (vm.currentView === 'list-condensed') {
        vm.currentView = 'grid-view';
      } else {
        vm.currentView = 'list-condensed';
      }
    }

    function switchDirectory(category) {
      $state.go('app.fileManager', {category: category});
      Files.get({category: category}, function (response) {
        vm.files = response.fileList;
        vm.breadcrumbs = response.breadcrumbs;

        vm.toggleAside('fileManagerAside')
      });

    }

    function selectFile(file) {

      vm.selectedFiles = [];
      selectMultiple(file, null);
      openDetailAside();
    }

    function selectMultiple(file) {
      // vm.selectedFile = file;

      makeSelection(file);

      if (vm.selectedFiles.length === 0) {
        resetSelection();
      }
    }

    function selectAll() {
      if (!vm.allSelected) {
        vm.selectedFiles = [];
        if (vm.files.length > 0) {
          vm.selectedFile = vm.files[0];
        }
        angular.forEach(vm.files, function (file, ind) {
          vm.selectedFiles.push(file);
        });
      } else {
        vm.selectedFiles = [];
      }
      vm.allSelected = !vm.allSelected;
    }

    function deleteSelectedFolders() {
      $translate(['FILE_MANAGER.DELETE.DELETING', 'FILE_MANAGER.DELETE.FILES', 'FILE_MANAGER.DELETE.MSG_MULTI',
        'FILE_MANAGER.DELETE.MSG_MULTI_AFTER', 'FILE_MANAGER.GLOBAL.YES', 'FILE_MANAGER.GLOBAL.NO']).then(function (translations) {
        var numOfFiles = vm.selectedFiles.length;
        Lobibox.confirm({
          title: translations['FILE_MANAGER.DELETE.DELETING'] + numOfFiles + translations['FILE_MANAGER.DELETE.FILES'],
          msg: translations['FILE_MANAGER.DELETE.MSG_MULTI'],
          buttons: {
            yes: {
              text: translations['FILE_MANAGER.GLOBAL.YES']
            },
            no: {
              text: translations['FILE_MANAGER.GLOBAL.NO']
            }
          },
          callback: function (lobibox, btn) {
            if (btn === 'yes') {
              // @todo Your code goes here
              $scope.$apply(function () {
                angular.forEach(vm.selectedFiles, function (file, ind) {
                  vm.files.splice(vm.files.indexOf(file), 1);
                  vm.selectedFiles.splice(ind, 1);
                });
                resetSelection();
                Lobibox.notify('success', {
                  msg: numOfFiles + translations['FILE_MANAGER.DELETE.MSG_MULTI_AFTER']
                })
              });
            }
          }
        })
      })
    }

    function makeSelection(file) {
      vm.selectedFile = file;
      var ind;
      if ((ind = vm.selectedFiles.indexOf(file)) > -1) {
        vm.selectedFiles.splice(ind, 1);
        vm.allSelected = false;
      } else {
        vm.selectedFiles.push(file);
      }
    }

    function translateMenu() {

      $translate(['FILE_MANAGER.MENU.OPEN', 'FILE_MANAGER.MENU.SHARE', 'FILE_MANAGER.MENU.MANAGE_TAGS', 'FILE_MANAGER.MENU.CUT',
        'FILE_MANAGER.MENU.RENAME', 'FILE_MANAGER.MENU.DELETE', 'FILE_MANAGER.MENU.VIEW',
        'FILE_MANAGER.MENU.DOWNLOAD']).then(function (translations) {
        vm.allMenuOptions = {
          /*
           ['Menu item name', function ($itemScope, $event, modelValue, text, $li) {
           vm.selected = $itemScope.item.name;
           }]
           */
          "open": ["<i class='fa fa-folder-open' aria-hidden='true'></i> " + translations['FILE_MANAGER.MENU.OPEN'], openFn],
          "view": ["<i class='fa fa-eye' aria-hidden='true'></i> " + translations['FILE_MANAGER.MENU.VIEW'], viewFn],
          "download": ["<i class='fa fa-download' aria-hidden='true'></i> " + translations['FILE_MANAGER.MENU.DOWNLOAD'], downloadFn],
          "share": ["<i class='fa fa-share-alt' aria-hidden='true'></i> " + translations['FILE_MANAGER.MENU.SHARE'], shareFn],
          "tags": ["<i class='fa fa-tags' aria-hidden='true'></i> " + translations['FILE_MANAGER.MENU.MANAGE_TAGS'], manageTagsFn],
          "cut": ["<i class='fa fa-scissors' aria-hidden='true'></i> " + translations['FILE_MANAGER.MENU.CUT'], cutFn],
          "rename": ["<i class='fa fa-pencil' aria-hidden='true'></i> " + translations['FILE_MANAGER.MENU.RENAME'], renameFn],
          "null": null, // Divider
          "delete": ["<i class='fa fa-trash' aria-hidden='true'></i> " + translations['FILE_MANAGER.MENU.DELETE'], deleteFn]
        };
      });
    }

    function openDetailAside() {
      omAside.open("selectedFileAside");
      hasOffCanvasClass("selectedFileAside");
    }

    function resetSelection() {
      vm.selectedFile = null;
      omAside.close("selectedFileAside");
      if (vm.isOffCanvasMenuOpened)
        vm.isOffCanvasMenuOpened = false;
    }

    function isAvailableForPreview(file) {
      return vm.canPreview.indexOf(file.type) !== -1 && (file.preview !== "" || file.thumb !== "");
    }

    function chooseFiles(input) {
      $log.debug(input.files);
      // @todo Your code goes here
    }

    function chooseFolder(input) {
      $log.debug(input.files);
      // @todo Your code goes here
    }

    function checkFileType(file) {
      vm.menuOptions = [];
      vm.menuOptionsClone = angular.copy(vm.allMenuOptions);
      angular.forEach(vm.menuOptionsClone, function (value, key) {
        if (file.type === 'Folder' && !(key === 'view' || key === 'download')) {
          vm.menuOptions.push(value);
        } else if (!(file.type === 'Folder') && isAvailableForPreview(file) && !(key === 'open')) {
          vm.menuOptions.push(value);
        } else if (!(file.type === 'Folder') && !isAvailableForPreview(file) && !(key === 'open' || key === 'view')) {
          vm.menuOptions.push(value);
        }
      });
    }

    function menuItemClick($event, action, file) {
      $event.stopPropagation();
      vm.allMenuOptions[action][1]({file: file});
    }

    function openFn($itemScope) {
      $log.debug("Open Selected File" + "\nfileID: " + $itemScope.file.id);
      $log.debug($itemScope.file);
      // @todo Your code goes here
      // vm.selectedFile = $itemScope.file;
    }

    function viewFn($itemScope) {
      showPreviewFileDialog($itemScope.file);
    }

    function downloadFn($itemScope) {
      $log.debug("Download Selected File" + "\nfileID: " + $itemScope.file.id);
      $log.debug($itemScope.file);
      // @todo Your code goes here
    }

    function shareFn($itemScope) {
      $log.debug("Share Selected File" + "\nfileID: " + $itemScope.file.id);
      $log.debug($itemScope.file);
      // @todo Your code goes here
      // vm.selectedFile = $itemScope.file;
    }

    function manageTagsFn($itemScope) {
      // vm.selectedFile = $itemScope.file;
      showManageTagsDialog($itemScope.file);
    }

    function cutFn($itemScope) {
      $log.debug("Cut Selected File" + "\nfileID: " + $itemScope.file.id);
      $log.debug($itemScope.file);
      // @todo Your code goes here
      // vm.selectedFile = $itemScope.file;
    }

    function renameFn($itemScope) {
      // vm.selectedFile = $itemScope.file;
      showCreateRenameDialog($itemScope.file)
        .result.then(function (newName) {
        vm.selectedFile.name = newName.name;
        $log.debug("resolve", arguments);
      }, function () {
        $log.debug("reject")
      });
    }

    function deleteFn($itemScope) {
      // vm.selectedFile = $itemScope.file;
      showDeleteDialog($itemScope.file);
    }

    function showManageTagsDialog(currentFileFolder) {
      $uibModal.open({
        templateUrl: 'app/main/apps/file-manager/dialogs/manage-tags-dialog/manage-tags-dialog.html',
        controller: 'ManageTagsController',
        controllerAs: 'vm',
        resolve: {
          FileFolder: currentFileFolder
        }
      }).result.then(function (tags) {
        currentFileFolder.tags = tags;
        $log.debug("User updated tags", tags);
      }, function () {
        $log.debug("User canceled manage tags dialog")
      });
    }

    function filterListByTag(tag) {
      // if (tag != null) {
      //   vm.filterBy = tag;
      //   angular.element("#filteredBy").css("display", "inline-block");
      // } else {
      //   vm.filterBy = "";
      //   angular.element("#filteredBy").css("display", "none");
      // }
    }

    function showCreateFolderDialog() {
      $translate(['FILE_MANAGER.CREATE_RENAME.FOLDER','FILE_MANAGER.CREATE_RENAME.CREATE_MSG']).then(function (translations) {
      showCreateRenameDialog(null)
        .result.then(function (newFolder) {
        vm.files.push(newFolder);
        Lobibox.notify('success', {
          msg: translations['FILE_MANAGER.CREATE_RENAME.FOLDER']+' "' + newFolder.name + '"' + translations['FILE_MANAGER.CREATE_RENAME.CREATE_MSG']
        });
      }, function () {
        $log.debug("reject")
      });
      })
    }

    function showCreateRenameDialog(fileFolder) {
      return $uibModal.open({
        templateUrl: 'app/main/apps/file-manager/dialogs/create-rename-dialog/create-rename-dialog.html',
        controller: 'CreateRenameDialogController',
        controllerAs: 'vm',
        resolve: {
          FileFolder: fileFolder
        }
      })
    }

    function showPreviewFileDialog(file) {
      $translate(['FILE_MANAGER.GLOBAL.PREVIEW_ERROR']).then(function (translations) {
      if (vm.canPreview.indexOf(file.type) !== -1) {
        $uibModal.open({
          templateUrl: 'app/main/apps/file-manager/dialogs/preview-file/preview-file.html',
          controller: 'PreviewFileController',
          controllerAs: 'vm',
          size: 'md',
          resolve: {
            CurrentEntry: file
          }
        });
      } else {
        Lobibox.notify('error', {
          msg: translations['FILE_MANAGER.GLOBAL.PREVIEW_ERROR']
        });
      }
      })
    }

    function showDeleteDialog(file) {
      $translate(['FILE_MANAGER.DELETE.DELETING', 'FILE_MANAGER.DELETE.MSG_SINGLE',
        'FILE_MANAGER.DELETE.MSG_SINGLE_AFTER', 'FILE_MANAGER.DELETE.FOLDER', 'FILE_MANAGER.DELETE.FILE',
        'FILE_MANAGER.GLOBAL.YES', 'FILE_MANAGER.GLOBAL.NO']).then(function (translations) {
        Lobibox.confirm({
          title: translations['FILE_MANAGER.DELETE.DELETING'] + ' "' + file.name + '"',
          msg: translations['FILE_MANAGER.DELETE.MSG_SINGLE'] + (file.type.toLowerCase() === 'folder' ? translations['FILE_MANAGER.DELETE.FOLDER'] : translations['FILE_MANAGER.DELETE.FILE'] ) + "?",
          buttons: {
            yes: {
              text: translations['FILE_MANAGER.GLOBAL.YES']
            },
            no: {
              text: translations['FILE_MANAGER.GLOBAL.NO']
            }
          },
          callback: function (lobibox, btn) {
            if (btn === 'yes') {
              vm.files.splice(file.id, 1);
              resetSelection();
              Lobibox.notify('success', {
                msg: translations['FILE_MANAGER.DELETE.MSG_SINGLE_AFTER']
              })
            }

            D
          }
        });
      })
    }

    function toggleAside(id) {
      omAside.toggle(id);
      hasOffCanvasClass(id);
    }

    function hasOffCanvasClass(id) {
      if (angular.element('#' + id).hasClass('is-off-canvas')) {
        vm.isOffCanvasMenuOpened = true;
      }
      $log.debug(vm.isOffCanvasMenuOpened);
    }

    function changeDirectory(crumb) {
      vm.breadcrumbs = vm.breadcrumbs.slice(0, vm.breadcrumbs.indexOf(crumb) + 1);
    }
  }
})();
