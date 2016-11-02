/**
 * @class bookSearch.factories
 * @memberOf bookSearch
 * @author Peter Keller
 */
angular.module('bookSearch.factories', [])
  /**
   * @class ServerConnector
   * @memberOf bookSearch.factories
   * @description Handle everything related getting and posting to the server.
   */
.factory('ServerConnector', ["$http", "ServerAddress", function($http, ServerAddress) {
  var serverConnector = {

  };
  /**
   * @function addBook
   * @memberOf bookSearch.factories.ServerConnector
   * @param {string} title
   * @param {string} author
   * @param {number} isbn
   * @param {number} price
   * @param {number} year_released
   * @param {string} adOrbc
   */
  serverConnector.addBook = function(title, author, isbn, price, year_released, adOrbc) {
    return $http({
      method: "post",
      url: ServerAddress + "/addBook.php",
      data: {
        title: title,
        author: author,
        isbn: isbn,
        price: price,
        year_released: year_released,
        adOrbc: adOrbc
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  };

  /**
   * @function search
   * @memberOf bookSearch.factories.ServerConnector
   * @param {string} search
   */
  serverConnector.search = function(search) {
    return $http({
      method: "post",
      url: ServerAddress + "/search.php",
      data: {
        search: search
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  };

  /**
   * @function getAllBooks
   * @memberOf bookSearch.factories.ServerConnector
   */
  serverConnector.getAllBooks = function() {
    return $http({
      method: "get",
      url: ServerAddress + "/getAllBooks.php"
    });
  };

  /**
   * @function deleteBook
   * @memberOf bookSearch.factories.ServerConnector
   * @param {number} ID
   */
  serverConnector.deleteBook = function(ID) {
    return $http({
      method: "post",
      url: ServerAddress + "/deleteBook.php",
      data: {
        ID: ID
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  };

  /**
   * @function updateBook
   * @memberOf bookSearch.factories.ServerConnector
   * @param {number} ID
   * @param {string} title
   * @param {string} author
   * @param {number} isbn
   * @param {number} price
   * @param {number} year_released
   * @param {string} adOrbc
   */
  serverConnector.updateBook = function(ID, title, author, isbn, price, year_released, adOrbc) {
    return $http({
      method: "post",
      url: ServerAddress + "/updateBook.php",
      data: {
        ID: ID,
        title: title,
        author: author,
        isbn: isbn,
        price: price,
        year_released: year_released,
        adOrbc: adOrbc
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  };

  return serverConnector;
}]);
