/*global angular */
var myApp = angular.module('FoodPortal', ['ngRoute', 'services', 'indexModule']);
var uri = "http://localhost:52281/api/";

myApp.config(function ($routeProvider) {
  // $locationProvider.hashPrefix('');
   $routeProvider
  .when('/', {
    url: "/",
    templateUrl: "views/main.html",
    controller: "mainController"
  })

  .when('/MainVendor', {
    url: "/mainVendor",
    templateUrl: "views/mainVendor.html",
    controller: "mainVendorController"
  })

  .when('/Products', {
    url: "/Products",
    templateUrl: "views/Products/Products.html",
    controller: "productsController"
  })

  .when('/Beverages', {
    url: "/Beverages",
    templateUrl: "views/Products/beverages.html",
    controller: "categoriesController"
  })

  .when('/Snacks', {
    url: "/Snacks",
    templateUrl: "views/Products/snacks.html",
    controller: "categoriesController"
  })

  .when('/Drinks', {
    url: "/Drinks",
    templateUrl: "views/Products/drinks.html",
    controller: "categoriesController"
  })

  .when('/Cart', {
    url: "/Cart",
    templateUrl: "views/cart/usercart.html",
    controller: "cartController"
  })

  .when('/Conformorder', {
    url: "/Conformorder",
    templateUrl: "views/orders/conformorder.html",
    controller: "ordersController"
  })

  .when('/Login', {
    url:  "/Login",
    templateUrl:"views/users/login.html",
    controller: "loginController"
  })

  .when('/Register', {
    url: "/Register",
    templateUrl: "views/users/register.html",
    controller: "registerController"
  })

  .when('/AddProduct', {
    url: "/AddProduct",
    templateUrl: "views/Products/AddProduct.html",
    controller: "AddProductController"
  })

  .when('/ChangePassword',{
    url: "/ChangePassword",
    templateUrl: "views/users/changePassword.html",
    controller: "PasswordController"
  })
});

myApp.controller('mainController', ['$scope', '$http', '$log', 'AddToCartService', '$rootScope',
function($scope, $http, $log, AddToCartService, $rootScope){
  //search
  $scope.hide_loading = true;
  $scope.searchString;
  $scope.Products;
  $scope.disableCart = false;
  $rootScope.$on("DisableCart", function() {
    $scope.disableCart = true;
  })
  $scope.searchProduct = function () {
      $scope.hide_loading = false;
    var searchProduct = {
      "Name" : $scope.searchString
    };
    if(localStorage.getItem("ClientId") == null)
    {
        $scope.disableCart = true;
    }
    console.log(searchProduct);
    $http({
      method: 'POST',
      url: uri + 'Products/SearchProduct/',
      data: searchProduct,
      headers: { 'Content-Type': 'application/json' }
    }).then(function successCallBack(response) {
        console.log(response.data);
        if(response.data.length == 0)
            alert('No search results !!');
        $scope.Products = response.data;
        $scope.hide_loading = true;
      }), function errorCallBack(errorResponse) {
          $scope.Products = errorResponse.data;
    };
  };

  //scope var: To store value(id) of a clicked button
  $scope.id;

  //function to add particular product to the cart
  $scope.AddToCart = function (element) {
      $scope.id = element.currentTarget.value;
      AddToCartService.ADD($scope.id);
  };
}]);

// main venndor controller

myApp.controller('mainVendorController', ['$scope', '$http', '$log', 'AddToCartService', '$rootScope',
function($scope, $http, $log, AddToCartService, $rootScope){
    // secure access only
    if(localStorage.getItem("ClientId") == null && localStorage.getItem("VendorId") == null) {
        $scope.showMain = false;
        $scope.showError = true;
    }
    else if(localStorage.getItem("VendorId") == null && localStorage.getItem("ClientId") != null) {
        $scope.showMain = false;
        $scope.showError = true;
    }
    else {
        $scope.showMain = true;
        $scope.showError = false;
    }
    //----------------------

    //search
  $scope.hide_loading = true;
  $scope.searchString;
  $scope.Products;
  $scope.searchProduct = function () {
    $scope.hide_loading = false;
    var searchProduct = {
      "Name" : $scope.searchString
    };
    if(localStorage.getItem("ClientId") == null)
    {
        $scope.disableCart = true;
    }
    console.log(searchProduct);
    $http({
      method: 'POST',
      url: uri + 'Products/SearchProduct/',
      data: searchProduct,
      headers: { 'Content-Type': 'application/json' }
    }).then(function successCallBack(response) {
        console.log(response.data);
        if(response.data.length == 0)
            alert('No search results !!');
        $scope.Products = response.data;
        $scope.hide_loading = true;
      }), function errorCallBack(errorResponse) {
          $scope.Products = errorResponse.data;
    };
  };

  //scope var: To store value(id) of a clicked button
  $scope.id;

  //function to add particular product to the cart
  $scope.Delete = function (element) {
      $scope.id = element.currentTarget.value;
      console.log($scope.id);
      var obj = {
          ProductId: $scope.id
      };
      $http({
          method: 'DELETE',
          url: uri + 'Products/DeleteProduct',
          data: JSON.stringify(obj),
          headers: { 'content-type': 'application/json' }
      }).then(function successCallback(response) {
          console.log(response.data);
          alert(response.data);
          $scope.searchProduct();
          }, function errorCallback(errorResponse) {
              console.log(errorResponse.data);
              alert(errorResponse.data);
      });
  };
}]);

myApp.controller('productsController', ['$scope', '$log', '$http', 'AddToCartService', function($scope, $log, $http, AddToCartService){
  $scope.data;
  $scope.id;
  $scope.disableCart = false;
  if(localStorage.getItem("ClientId") == null)
  {
    $scope.disableCart = true;
  }
  $http({
    method: 'GET',
    url: uri + 'Products/GetProducts/',
    header:{
      'Content-Type':'application/json;'
    }
  }).then(function success(response){
      console.log(response.data);
      $scope.data = response.data;
  }), function error(errorResponse){
    console.log(errorResponse);
  };

  $scope.AddToCart = function (element) {
    $scope.id = element.currentTarget.value;
    AddToCartService.ADD($scope.id);
  };
}]);

myApp.controller('categoriesController', ['$scope', '$http', 'AddToCartService', function ($scope, $http, AddToCartService) {
  var _value = document.getElementById('x').value;
  $scope.disableCart = false;
  if(localStorage.getItem("ClientId") == null)
  {
    $scope.disableCart = true;
  }
  $scope.responseCategory;
  var productcategory = {
    Category: _value
  };
  $http({
    method: 'POST',
    data: JSON.stringify(productcategory),
    headers: { 'Content-Type': 'application/json' },
    url: uri + 'Products/GetCategoryProduct/'
  }).then(function successCallBack(response) {
      console.log(response.data);
      $scope.responseCategory = response.data;
  }), function errorCallBack(errorResponse) {
      console.log(errorResponse.data);
  };

  console.log(_value);

  $scope.AddToCart = function (element) {
    $scope.id = element.currentTarget.value;
    AddToCartService.ADD($scope.id);
  };
}]);

//cartController
myApp.controller('cartController', ['$scope', '$http', '$rootScope', 'DeleteFromCartService', '$location', 'tempQuantity', function($scope, $http, $rootScope, DeleteFromCartService, $location, tempQuantity) {
    // secure access only
    if(localStorage.getItem("ClientId") == null && localStorage.getItem("VendorId") == null) {
        $scope.showMain = false;
        $scope.showError = true;
    }
    else if(localStorage.getItem("VendorId") != null && localStorage.getItem("ClientId") == null) {
        $scope.showMain = false;
        $scope.showError = true;
    }
    else {
        $scope.showMain = true;
        $scope.showError = false;
    }
    //----------------------
  $scope.responsecart;
  $scope.pid;
  // $scope.qtys_pid=[];

  var len = 0;
  var flag = 0;
  $scope.disableOrder = false;
  var total_price = [];
  var qtys_pid = [];
  $scope.id;
    var obj = {
      ClientId: localStorage.getItem("ClientId")
    };
    $http({
      method: 'POST',
      url: uri + 'Carts/GetCarts/',
      data: JSON.stringify(obj),
      headers: { 'content-type': 'application/json' }
    }).then(function successCallBack(response) {
          $scope.responsecart = response.data;
          len = response.data.length;
          if(len == 0)
            $scope.disableOrder = true;
          $scope.initializeArray();
          $scope.initializeQtys_pid(len);
      }, function errorCallBack(errorResponse) {
          console.log(errorResponse.data);
      });

  //Quantity Positive
  //$scope.responsecart.total;
  $scope.initializeArray = function() {
    $scope.price = 1;
    $scope.qty = 1;
    $scope.grandtotal = 0;
    total_price = new Array(len);
    for(var i=0; i < len; i++) {
        total_price[i] = $scope.responsecart[i].Price;
        $scope.grandtotal += total_price[i];
    }
  }
  $scope.initializeQtys_pid = function(len) {
    qtys_pid = new Array(len).fill(1);
    for(var i=0; i<len; i++)
    {
        tempQuantity.setArray(i, 1);
    }
  }

  $scope.posistiveQty = function(qty, index) {
    $scope.grandtotal = 0;
    $scope.maxQuantity = $scope.responsecart[index].Quantity;
    if(qty == 0){
      alert("Value can't be zero!");
      flag = 1;
    }
    else if(qty < 0) {
      alert("Value can't be negative!");
      flag = 1;
    }
    else if(qty > $scope.maxQuantity) {
        flag = 1;
        alert("Quantity can't exceed " + $scope.maxQuantity);
    }
    else {
        flag = 0;
    }
    total_price[index] = qty * $scope.responsecart[index].Price;
    for(var i=0; i < len; i++) {
        $scope.grandtotal += total_price[i];
    }
    console.log(total_price);
    localStorage.setItem('grandtotal', $scope.grandtotal);
    if(flag == 1)
    {
      $scope.disableOrder = true;
    }
    else{
      $scope.disableOrder = false;
    }

    //$scope.qtys_pid = new Array($scope.responsecart.length).fill(1);
    //console.log(index);
    qtys_pid[index] = qty;
    tempQuantity.setArray(index, qty);
    console.log(qtys_pid);
  };

  //Delete from cart
  $scope.DeleteProduct = function (element) {
    $scope.id = element.currentTarget.value;
    console.log($scope.id);
    DeleteFromCartService.Delete($scope.id);
    location.reload();
  };

  $scope.PlaceOrder = function() {
    //alert('Order placed successfully!!');
    var username = localStorage.getItem('ClientId');
    var payment;
    var paymentstatus;

    $scope.pid = new Array($scope.responsecart.length);
    //console.log(qtys_pid);

    for(var i=0; i < $scope.pid.length; i++){
      $scope.pid[i] = $scope.responsecart[i].ProductId;
      var cart = {
        ProductId: $scope.pid[i],
        ClientId: localStorage.getItem('ClientId'),
        Quantity : qtys_pid[i]
      };
      $http({
        method : 'POST',
        url : uri + 'Carts/PostQuantity/',
        data : JSON.stringify(cart),
        headers : {'content-type' : 'application/json'}
      }).then(function success(response){
        console.log(response.data);
      }), function error(errorResponse){
        console.log(errorResponse.data);
      };
    }
    $rootScope.$on('CallToreduceQuantity', function() {
        for(var i=0; i < $scope.pid.length; i++){
          //$scope.pid[i] = $scope.responsecart[i].ProductId;
          var cart = {
            ProductId: $scope.pid[i],
            ClientId: localStorage.getItem('ClientId'),
            Quantity : qtys_pid[i]
          };

          $http({
            method : 'POST',
            url : uri + 'Orders/ReduceQuantity/',
            data : JSON.stringify(cart),
            headers : {'content-type' : 'application/json'}
          }).then(function success(response){
            console.log(response.data);
          }), function error(errorResponse){
            console.log(errorResponse.data);
          };
        }
    });
    $location.url('/Conformorder');
  };


}]);

//orders controller
myApp.controller('ordersController', function($scope, $http, $rootScope, tempQuantity) {
  $scope.username;
  $scope.total;
  $scope.paymentstatus;

  var getDetails = function() {
    $scope.username = localStorage.getItem('ClientId');
    $scope.total = localStorage.getItem('grandtotal');
  };

  getDetails();

//   console.log(tempQuantity.getArray());
//   console.log(tempQuantity.getArrayByIndex(0));
  var len = Object.keys(tempQuantity.getArray()).length;

  $scope.conformorder = function () {
    $rootScope.$emit('CallToreduceQuantity', {});
    for(var i=0; i<len; i++)
    {
        var dborder = {
            Username : $scope.username,
            Payment : $scope.total,
            Payment_Mode : $scope.paymentstatus,
            ProductId : tempQuantity.getArrayByIndex(i)
          };
          console.log(JSON.stringify(dborder));
          $http({
            method : 'POST',
            data : JSON.stringify(dborder),
            url : uri + 'Orders/PostOrder/',
            headers : {'content-type' : 'application/json'}
          }).then (function success(response){
            console.log(response.data);
            alert(response.data);
          }), function error(errorResponse){
            console.log(errorResponse.data);
            alert(errorResponse.data);
          };
    }
    
  };
})

//loginController
myApp.controller('loginController', ['$scope', '$http', '$window', '$rootScope', '$location', function($scope, $http, $window, $rootScope, $location) {
  $scope.regexUsername = "^[a-zA-Z0-9]*$";
    $scope.regexPassword = "^[a-zA-Z0-9]*$";
    $scope.regexName = "^[A-Za-z ]+$";
    $scope.regexContact = "^[0-9]*$";
    $scope.showLoginMessage = false;

    $scope.Login = function () {
        if (!$scope.loginAsVendor) {
            var dataObj = {
                ClientId: $scope.ClientId,
                Password: $scope.Password,
                Name: null,
                Email: null,
                Address: null,
                Contact: null
            };
            console.log(JSON.stringify(dataObj));
            $http({
                method: 'POST',
                url: uri + 'Clients/ClientLogin',
                data: JSON.stringify(dataObj),
                headers: { 'content-type': 'application/json' }
            }).then(function successCallback(response) {
                localStorage.setItem("ClientId", response.data);
                $scope.loginMessage = response.data;
                $rootScope.$emit("CallOnLogin",{});
                $scope.showLoginMessage = true;
                //redirect to state: '/'
                $location.url('/');
                alert(localStorage.getItem("ClientId") + "" + "is now logged in");
            }, function errorCallback(response) {
                $scope.loginMessage = "Error !! Kindly check your credentials";
                $scope.showLoginMessage = true;

            });
        }
        else {
            var dataObj = {
                VendorId: $scope.ClientId,
                Password: $scope.Password,
                Name: null,
                Email: null,
                Address: null,
                Contact: null
            };
            console.log(JSON.stringify(dataObj));
            $http({
                method: 'POST',
                url: uri + 'Vendors/VendorLogin',
                data: JSON.stringify(dataObj),
                headers: { 'content-type': 'application/json' }
            }).then(function successCallback(response) {
                localStorage.setItem("VendorId", response.data);
                $scope.loginMessage = response.data;
                $scope.showLoginMessage = true;
                $rootScope.$emit("CallOnLogin", {});
                //$state.transitionTo('', {arg: 'arg'});
                //$window.location.href = '/Main/VendorIndex';
                $location.url('/MainVendor');
            }, function errorCallback(response) {
                $scope.loginMessage = "Error !! Kindly check your credentials";
                $scope.showLoginMessage = true;
            });
        }
    }
}]);

//vendor
myApp.controller('AddProductController', function ($scope, $http) {
    // secure access only
    if(localStorage.getItem("ClientId") == null && localStorage.getItem("VendorId") == null) {
        $scope.showMain = false;
        $scope.showError = true;
    }
    else if(localStorage.getItem("VendorId") == null && localStorage.getItem("ClientId") != null) {
        $scope.showMain = false;
        $scope.showError = true;
    }
    else {
        $scope.showMain = true;
        $scope.showError = false;
    }
    //----------------------

  $scope.categories = ["Beverages", "Snacks", "Drinks"];
  $scope.p = {};
  $scope.AddProduct = function () {
      $http({
          method: 'POST',
          url: uri + 'Products/PostProduct',
          data: JSON.stringify($scope.p),
          headers: { 'content-type': 'application/json' }
      }).then(function (success) {
          alert("Product added successfully :)");
      }, function (error) {
          alert("Error !! Product can't be added ");
      });
  }
});

myApp.controller('PasswordController', function ($scope, $http, $window) {
    // secure access only
  if(localStorage.getItem("ClientId") == null && localStorage.getItem("VendorId") == null) {
      $scope.showMain = false;
      $scope.showError = true;
  }
  else {
      $scope.showMain = true;
      $scope.showError = false;
  }
  //----
  $scope.passwordChanged = false;
  $scope.passwordEquality = function () {
    if ($scope.newPassword != $scope.confirmPassword) {
      $scope.IsMatch = true;
    }
    else  $scope.IsMatch = false;
  };
  $scope.changePassword = function () {
     if(localStorage.getItem("ClientId") != null)
      changePasswordClient();
      else
      changePasswordVendor();
  }

  var changePasswordVendor = function() {
      var dataObj = {
          VendorId: localStorage.getItem("VendorId"),
          Password: $scope.newPassword,
          Name: null,
          Email: null,
          Address: null,
          Contact: null
      };
      $http({
          method: 'POST',
          url: uri + 'Vendors/VendorPassword',
          data: JSON.stringify(dataObj),
          headers: { 'content-type': 'application/json' }
      }).then(function successCallback(response) {
          // $scope.passwordStatus = response.data;
          // $scope.passwordChanged = true;
          alert('Password Changed!');
      }, function errorCallback(response) {
          console.log(response.data);
      });
  }

  var changePasswordClient = function() {
    var dataObj = {
        ClientId: localStorage.getItem("ClientId"),
        Password: $scope.newPassword,
        Name: null,
        Email: null,
        Address: null,
        Contact: null
    };
    $http({
        method: 'POST',
        url: uri + 'Clients/ClientPassword',
        data: JSON.stringify(dataObj),
        headers: { 'content-type': 'application/json' }
    }).then(function successCallback(response) {
        // $scope.passwordStatus = response.data;
        // $scope.passwordChanged = true;
        alert('Password changed successfully');
    }, function errorCallback(response) {
        console.log(response.data);
    });
}
});

//registerController
myApp.controller('registerController', ['$scope','$http', function($scope, $http) {
  $scope.regexUsername = "^[a-zA-Z0-9]*$";
  $scope.regexPassword = "^[a-zA-Z0-9]*$";
  $scope.regexName = "^[A-Za-z ]+$";
  $scope.regexContact = "^[0-9]*$";
  $scope.IsMatch = false;

  $scope.register = {};
  $scope.Register = function () {
    console.log(JSON.stringify($scope.register));
    $http({
        method: 'POST',
        url: uri + 'Clients/PostClient',
        data: JSON.stringify($scope.register),
        headers: { 'content-type': 'application/json' }
    }).then(function (success) {
          alert("User successfully registered :)");
          $scope.register.length = 0;
        }, function (error) {
            alert("Error ! Register unsuccessful");
    });
  }
  $scope.passwordEquality = function () {
      if ($scope.register.Password != $scope.ConfirmPassword) {
        $scope.IsMatch = true;
      }
      else  $scope.IsMatch = false;
  };

  $scope.showUserNameMessage = false;
  $scope.userNameExists = function () {
      var username = { clientId: $scope.register.ClientId };
      $http({
          method: 'POST',
          url: uri + 'Clients/UserExists',
          data: JSON.stringify(username),
          headers: { 'content-type': 'application/json' }
      }).then(function successCallback(response) {
          $scope.userNameMessage = response.data;
          $scope.showUserNameMessage = true;
      }, function errorCallback(errorResponse) {
          $scope.userNameMessage = errorResponse.data;
          $scope.showUserNameMessage = true;
      });
  }

  $scope.showEmailExistsMessage = false;
  $scope.userEmailExists = function () {
      var userEmailData = { Email: $scope.register.Email };
      $http({
          method: 'POST',
          url: uri + 'Clients/EmailExists',
          data: JSON.stringify(userEmailData),
          headers: { 'content-type': 'application/json' }
      }).then(function successCallback(response) {
          $scope.showEmailExistsMessage = true;
          $scope.emailExistsMessage = response.data;
      }, function errorCallback(errorResponse) {
          $scope.showEmailExistsMessage = true;
          $scope.emailExistsMessage = errorResponse.data;
      });
  }

  //Function: To Clear username and email fields
  $scope.clearUserNameFields = function () {
      $scope.showUserNameMessage = "ng-value='False'";
      $scope.userNameMessage = null;
      $scope.register.ClientId = null;
  }

  $scope.clearEmailFields = function () {
      $scope.showEmailExistsMessage = "ng-value='False'";
      $scope.emailExistsMessage = null;
      $scope.register.Email = null;
  };
}]);

myApp.factory('tempQuantity', function () {
    var factory = {};
    var qtys_pid = {};

    factory.setArray = function(key, value) {
        qtys_pid[key] = value;
    }
    factory.getArrayByIndex = function(key) {
       return qtys_pid[key];
    };
    factory.getArray = function() {
        return qtys_pid;
     };
    return factory;
});
