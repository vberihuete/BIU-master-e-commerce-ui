angular.module('eCommerceApp', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'home.html'
      })
      .when('/products', {
        templateUrl: 'products.html'
      })
      .otherwise({
        redirectTo: '/home'
      });
  }])
  .controller('ShopController', ['$scope', '$http', function($scope, $http) {
    $scope.products = [];
    $scope.cart = [];

    // Hardcoded JSON data for products
    $scope.products = [
      { id: 1, name: 'Espresso', price: 3.99, image: 'placeholder.jpg' },
      { id: 2, name: 'Cappuccino', price: 4.49, image: 'placeholder.jpg' },
      { id: 3, name: 'Croissant', price: 2.99, image: 'placeholder.jpg' },
      { id: 4, name: 'Muffin', price: 3.49, image: 'placeholder.jpg' }
    ];

    /* Commented out API call
    // Fetch products from API
    $http.get('/api/products')
      .then(function(response) {
        $scope.products = response.data;
      })
      .catch(function(error) {
        console.error('Error fetching products:', error);
      });
    */

    // Add product to cart
    $scope.addToCart = function(product) {
      $scope.cart.push(product);
      // Optionally send to API: $http.post('/api/cart', product);
    };

    // Remove product from cart
    $scope.removeFromCart = function(item) {
      const index = $scope.cart.indexOf(item);
      if (index > -1) {
        $scope.cart.splice(index, 1);
        // Optionally update API: $http.delete('/api/cart/' + item.id);
      }
    };

    // Calculate total cart value
    $scope.getTotal = function() {
      return $scope.cart.reduce((total, item) => total + item.price, 0);
    };
  }]);