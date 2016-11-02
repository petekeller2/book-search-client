angular.module('bookSearch', ['ionic', 'ui.router', 'bookSearch.controllers', 'bookSearch.factories', 'bookSearch.config', 'jett.ionic.filter.bar'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
      url: "/",
      abstract: true,
      views: {
        'nav': {
          templateUrl: "templates/searchBar.html",
          controller: 'AppCtrl'
        }
      }
    })

    .state('app.details', {
      url: 'details/{book:json}',
      views: {
        'content@': {
          templateUrl: 'templates/details.html',
          controller: 'DetailsCtrl'
        }
      }
    })
    .state('app.list', {
      url: 'list',
      views: {
        'content@': {
          templateUrl: 'templates/list.html',
          controller: 'ListCtrl'
        }
      }
    })
    .state('app.addBook', {
      url: 'addBook',
      views: {
        'content@': {
          templateUrl: 'templates/addBook.html',
          controller: 'AddBookCtrl'
        }
      }
    })

  ;
// if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/addBook');
});
