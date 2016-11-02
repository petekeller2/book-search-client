/**
 * @class bookSearch.controllers
 * @memberOf bookSearch
 * @author Peter Keller
 */
angular.module('bookSearch.controllers', [])
/**
 * @class DetailsCtrl
 * @memberOf bookSearch.controllers
 * @param {object} bookDetails
 */
.controller('DetailsCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$timeout', '$ionicScrollDelegate', 'ServerConnector', '$rootScope', function($scope, $stateParams, $ionicPopup, $state, $timeout, $ionicScrollDelegate, ServerConnector, $rootScope) {

  $scope.$on('$ionicView.enter', function() {
    $ionicScrollDelegate.scrollTop();
    $scope.bookDetails = {};
    //console.log("$stateParams.book", $stateParams.book);
    if($stateParams && $stateParams.book) {
      $scope.bookDetails = $stateParams.book;
      //console.log("$scope.bookDetails", $scope.bookDetails);
    }
    else {
      var noBookDetailsPopup = $ionicPopup.alert({
        title: 'No books details!'
      });

      noBookDetailsPopup.then(function(res) {
        $state.go('app.list');
      });

      $timeout(function() {
        noBookDetailsPopup.close();
        $state.go('app.list');
      }, 1000);
    }
  });

  $ionicScrollDelegate.scrollTop();

  $scope.bookDetails = {};

  /**
   * @function getDetailsData
   * @memberOf bookSearch.controllers.DetailsCtrl
   */
  $scope.getDetailsData = function() {
    //console.log("$stateParams.book", $stateParams.book);
    var bookDetails = angular.copy($stateParams.book);
    bookDetails.adOrbc = "AD";
    if (bookDetails.year_released) {
      if (String(bookDetails.year_released).charAt(0) == '-') {
        bookDetails.adOrbc = "BC";
      }
      else {
        //console.log("String(bookDetails.year_released).charAt(0)", String(bookDetails.year_released).charAt(0));
      }
      var year_released = Number(bookDetails.year_released);
      //console.log("year_released", year_released);
      if (year_released > 0) {
        bookDetails.year_released = year_released;
      }
      else {
        bookDetails.adOrbc = "BC";
        bookDetails.year_released = Math.abs(year_released);
      }
    }
    if (bookDetails.price) {
      bookDetails.price = Number(bookDetails.price);
    }
    if (bookDetails.isbn) {
      bookDetails.isbn = Number(bookDetails.isbn);
    }
    $scope.bookDetails = bookDetails;
    //console.log("$scope.bookDetails", $scope.bookDetails);
  };

  $scope.getDetailsData();

  /**
   * @function deleteBook
   * @memberOf bookSearch.controllers.DetailsCtrl
   */
  $scope.deleteBook = function() {
    if($scope.bookDetails && $scope.bookDetails.ID) {
      var id = Number($scope.bookDetails.ID);
      var deleteBook = ServerConnector.deleteBook(id);

      deleteBook.then(function (deleteBookResponse) {
        //console.log("deleteBookResponse", deleteBookResponse);
        if (deleteBookResponse && deleteBookResponse.status == 200) {
          if (deleteBookResponse.data) {
            if (deleteBookResponse.data === "Book deleted!") {
              var bookDeletedSuccessfullyPopup = $ionicPopup.alert({
                title: deleteBookResponse.data
              });

              $rootScope.clearSearchResults();

              $timeout(function () {
                bookDeletedSuccessfullyPopup.close();
              }, 1000);

              $state.go('app.list');

            }
            else {
              //console.log("Delete Error");
              var deleteErrorPopup = $ionicPopup.alert({
                title: "Error " + deleteBookResponse.data
              });

              $timeout(function () {
                deleteErrorPopup.close();
              }, 1000);

            }
          }
          else {
            //console.log("Error:", deleteBookResponse.data);
            var statusDeleteErrorPopup = $ionicPopup.alert({
              title: "Error: " + deleteBookResponse.data
            });

            $timeout(function () {
              statusDeleteErrorPopup.close();
            }, 1000);
          }
        }
        else {
          //console.log("Error: no data from the server");
          var noDataDeletePopup = $ionicPopup.alert({
            title: "Error: no data from the server"
          });

          $timeout(function () {
            noDataDeletePopup.close();
          }, 1000);
        }
      });
    }
    else {
      var bookIDMissingDeletePopup = $ionicPopup.alert({
        title: "Book ID Missing!"
      });

      $timeout(function () {
        bookIDMissingDeletePopup.close();
      }, 1000);
    }
  };

  /**
   * @function updateBook
   * @memberOf bookSearch.controllers.DetailsCtrl
   */
  $scope.updateBook = function() {
    if($scope.bookDetails && $scope.bookDetails.ID) {
      var id = Number($scope.bookDetails.ID);

      var updateBook = ServerConnector.updateBook(id, $scope.bookDetails.title, $scope.bookDetails.author, $scope.bookDetails.isbn, $scope.bookDetails.price, $scope.bookDetails.year_released, $scope.bookDetails.adOrbc);
      updateBook.then(function (updateBookResponse) {
        //console.log("updateBookResponse", updateBookResponse);
        if (updateBookResponse && updateBookResponse.status == 200) {
          var updatedBookPopup = $ionicPopup.alert({
            title: "Book updated!"
          });

          $timeout(function() {
            updatedBookPopup.close();
          }, 1000);

          $rootScope.clearSearchResults();

          $state.go("app.list");
        }
        else {

        }
      });
    }
    else {
      var bookIDMissingUpdatePopup = $ionicPopup.alert({
        title: "Book ID Missing!"
      });

      $timeout(function () {
        bookIDMissingUpdatePopup.close();
      }, 1000);
    }
  };

}])
/**
 * @class ListCtrl
 * @memberOf bookSearch.controllers
 * @param {boolean} searchDone
 * @param {array} searchResults
 */
.controller('ListCtrl', ['$scope', '$rootScope', '$state', '$ionicPopup', function($scope, $rootScope, $state, $ionicPopup) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.searchDone = false;
    if($rootScope.searchResults && $rootScope.searchResults.length > 0) {

    }
    else {
      var noBooksFoundPopup = $ionicPopup.alert({
        title: 'No books found!'
      });

      noBooksFoundPopup.then(function(res) {
        $state.go('app.addBook');
      });
    }
  });

  $rootScope.searchDone = false;

  //console.log("searchResults", $rootScope.searchResults);

  /**
   * @function goToAddBook
   * @memberOf bookSearch.controllers.ListCtrl
   */
  $scope.goToAddBook = function() {
    $state.go("app.addBook");
  };

  /**
   * @function goToDetails
   * @memberOf bookSearch.controllers.ListCtrl
   */
  $scope.goToDetails = function(book) {
    //console.log("book", book);
    $state.go('app.details', {book: book});
  };

}])
/**
 * @class AddBookCtrl
 * @memberOf bookSearch.controllers
 * @param {object} inputs
 */
.controller('AddBookCtrl', ['$scope', '$state', '$ionicPopup', 'ServerConnector', '$timeout', '$rootScope', function($scope, $state, $ionicPopup, ServerConnector, $timeout, $rootScope) {

  $scope.inputs = {
    title: null,
    author: null,
    isbn: null,
    price: null,
    year_released: null,
    adOrbc: 'AD'
  };
  //console.log("inputs", $scope.inputs);

  /**
   * @function addBook
   * @memberOf bookSearch.controllers.AddBookCtrl
   */
  $scope.addBook = function() {
    if($scope.inputs && $scope.inputs.title) {
      var price, year_released, isbn;
      if($scope.inputs.price) {
        price = $scope.inputs.price.toFixed(2);
        price = Math.abs(price);
      }
      if($scope.inputs.year_released) {
        year_released = Math.floor($scope.inputs.year_released);
        year_released = Math.abs(year_released);
      }
      if($scope.inputs.isbn) {
        isbn = Number($scope.inputs.isbn);
      }
      var addBook = ServerConnector.addBook($scope.inputs.title, $scope.inputs.author, isbn, price, year_released, $scope.inputs.adOrbc);

      addBook.then(function (addBookResponse) {
        //console.log("addBookResponse", addBookResponse);
        if (addBookResponse && addBookResponse.status == 200) {
          var addedPopup = $ionicPopup.alert({
            title: "Book added!"
          });

          $scope.inputs = {
            title: null,
            author: null,
            isbn: null,
            price: null,
            year_released: null,
            adOrbc: 'AD'
          };

          $rootScope.clearSearchResults();

          $timeout(function() {
            addedPopup.close();
          }, 1000);
        }
      });
    }
    else {
      var titleMissingPopup = $ionicPopup.alert({
        title: "Title Missing!"
      });

      titleMissingPopup.then(function(res) {

      });
    }
  };

}])

/**
 * @class AppCtrl
 * @memberOf bookSearch.controllers
 * @param {array} searchResults
 */
.controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicPopup', '$ionicFilterBar', 'ServerConnector', '$timeout', function($scope, $rootScope, $state, $ionicPopup, $ionicFilterBar, ServerConnector, $timeout) {

  /**
   * @function showSearchBar
   * @memberOf bookSearch.controllers.AppCtrl
   */
  $scope.showSearchBar = function() {
    //console.log("$state.current", $state.current);
    if($state.current && $state.current.name != 'app.list') {
      $state.go('app.list');
    }
    else {
      var filterBarInstance = $ionicFilterBar.show({
        cancelText: "<i class='ion-ios-close-outline'></i>",
        items: $scope.searchResults,
        update: function (filteredItems, filterText) {
          //console.log("filterText", filterText);
          //If this is to be modified, modify ft_min_word_len (the MySql server system variable) as well
          if (filterText && filterText.length > 2) {
            $scope.bookSearch(filterText);
          }
        }
      });
    }
  };

  $rootScope.searchResults = [];

  /**
   * @function clearSearchResults
   * @memberOf bookSearch.controllers.AppCtrl
   */
  $rootScope.clearSearchResults = function() {
    $rootScope.searchResults = [];
  };

  /**
   * @function getAllBooks
   * @memberOf bookSearch.controllers.AppCtrl
   */
  $rootScope.getAllBooks = function() {
    //console.log("getAllBooks");
    var getAllBooks = ServerConnector.getAllBooks();

    getAllBooks.then(function (bookResponse) {
      //console.log("bookResponse", bookResponse);
      if (bookResponse && bookResponse.status == 200) {
        if(bookResponse.data) {
          if(typeof bookResponse.data == 'object') {
            $rootScope.searchDone = true;
            if (bookResponse.data.length > 0) {
              //console.log(bookResponse.data);
              $rootScope.searchResults = bookResponse.data;
              //console.log("$rootScope.searchResults", $rootScope.searchResults);
            }
            else {
              //console.log("No books");
              $rootScope.searchResults = [];

              var noBooksPopup = $ionicPopup.alert({
                title: "No books"
              });

              $timeout(function() {
                noBooksPopup.close();
              }, 1000);

            }
          }
          else {
            //console.log("Error:", bookResponse.data);
            var allBooksErrorPopup = $ionicPopup.alert({
              title: "Error: " + bookResponse.data
            });

            $timeout(function() {
              allBooksErrorPopup.close();
            }, 1000);
          }
        }
        else {
          //console.log("Error: no data from the server");
          var noDataAllPopup = $ionicPopup.alert({
            title: "Error: no data from the server"
          });

          $timeout(function() {
            noDataAllPopup.close();
          }, 1000);
        }
      }
    });
  };

  /**
   * @function bookSearch
   * @memberOf bookSearch.controllers.AppCtrl
   * @param {string} searchQuery
   */
  $scope.bookSearch = function(searchQuery) {
    var search = ServerConnector.search(searchQuery);

    search.then(function (searchResponse) {
      console.log("searchResponse", searchResponse);
      if (searchResponse && searchResponse.status == 200) {
        if(searchResponse.data) {
          if(typeof searchResponse.data == 'object') {
            $rootScope.searchDone = true;
            if (searchResponse.data.length > 0) {
              //console.log(searchResponse.data);
              $rootScope.searchResults = searchResponse.data;
              $state.go('app.list');
            }
            else {
              //console.log("No search results");
              $rootScope.searchResults = [];
              /*
              var noSearchResultsPopup = $ionicPopup.alert({
                title: "No search results"
              });

              $timeout(function() {
                noSearchResultsPopup.close();
              }, 1000);
              */
            }
          }
          else {
            //console.log("Error:", searchResponse.data);
            var searchErrorPopup = $ionicPopup.alert({
              title: "Error: " + searchResponse.data
            });

            $timeout(function() {
              searchErrorPopup.close();
            }, 1000);
          }
        }
        else {
          //console.log("Error: no data from the server");
          var noDataPopup = $ionicPopup.alert({
            title: "Error: no data from the server"
          });

          $timeout(function() {
            noDataPopup.close();
          }, 1000);
        }
      }
    });
  }

}])

;
