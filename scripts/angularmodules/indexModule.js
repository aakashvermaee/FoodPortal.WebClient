var index = angular.module('indexModule', []);

index.controller('indexController', function($scope, $rootScope, $location){
  $scope.onInit = function(){
    $scope.onLogin();
  };
  $rootScope.$on("CallOnLogin", function() {
    $scope.onLogin();
  })
  $scope.onLogin = function(){
    var clientName  = localStorage.getItem("ClientId");
    var vendorName  = localStorage.getItem("VendorId");
    if (clientName == null && vendorName == null){
      $scope.showLogin = true;
      $scope.showRegister = true;
      $scope.showClientPrompt = false;
      $scope.showVendorPrompt = false;
      $scope.showCart = false;
      $scope.showChangePassword = false;
      $scope.clientMain = true;
      $scope.clientBeverages = true;
      $scope.clientSnacks = true;
      $scope.clientDrinks = true;
      $scope.clientProducts = true;
      $scope.showLogout = false;
    }
    else {
      //$scope.showClientPrompt = true;
      $scope.showLogout = true;
      if(clientName != null)
      {
        $scope.messageClient = "Welcome Client, " + clientName;
        $scope.showCart = true;
        $scope.clientMain = true;
        $scope.clientBeverages = true;
        $scope.clientSnacks = true;
        $scope.clientDrinks = true;
        $scope.clientProducts = true;
        $scope.vendorAdd = false;
        $scope.vendorMain = false;
        $scope.showClientPrompt = true;
      }       
      else
      {
        $location.url('/MainVendor');
        $scope.messageVendor = "Welcome Vendor, " + vendorName;
        $scope.showCart = false;
        $scope.clientMain = false;
        $scope.clientBeverages = false;
        $scope.showVendorPrompt = true;
        $scope.clientSnacks = false;
        $scope.clientDrinks = false;
        $scope.clientProducts = false;
        $scope.vendorAdd = true;
        $scope.vendorMain = true;
      }
      $scope.showLogin = false;
      $scope.showRegister = false;
      $scope.showChangePassword = true;
    }
  };
  $scope.onLogout = function() {
    $rootScope.$emit("DisableCart",{});

    if(localStorage.getItem("ClientId") != null)
      localStorage.removeItem("ClientId");
    if(localStorage.getItem("VendorId") != null)
      localStorage.removeItem("VendorId");
    $scope.showClientPrompt = false;
    $scope.showVendorPrompt = false;
    $scope.showCart = false;
    $scope.showLogin = true;
    $scope.showRegister = true;
    $scope.showChangePassword = false;
    $scope.clientMain = true;
    $scope.clientBeverages = true;
    $scope.clientSnacks = true;
    $scope.clientDrinks = true;
    $scope.clientProducts = true;
    $scope.vendorAdd = false;
    $scope.vendorMain = false;
    $scope.showLogout = false;
  }
});
