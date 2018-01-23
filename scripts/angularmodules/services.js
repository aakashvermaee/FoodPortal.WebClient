//SERVICES
var services = angular.module('services', []); 
var uri = "http://localhost:52281/api/";

//SERVICE: to add an element to the cart based on the passed product's id
services.factory('AddToCartService', ['$http', function ($http) {
    var ADD = function (id) {
        console.log('clicked on ' + id);
        var prodId = {
            ClientId: localStorage.getItem("ClientId"),
            ProductId: id
        };
        console.log(prodId);
        $http({
            method: 'POST',
            url: uri + 'Carts/PostCart',
            data: JSON.stringify(prodId),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallBack(response) {
            console.log(response.data);
            alert(response.data);
        }), function errorCallBack(errorResponse) {
            console.log(errorResponse);
            alert(response.data);
        };
    };
    return {
        ADD: ADD
    };
}]);

//SERVICE: to delete an element from the cart based on the passed CartId
services.factory('DeleteFromCartService', ['$http', function($http) {
    var Delete = function (Id) {
        var obj = {
            ProductId: Id
        };
        console.log(obj);
        $http({
            method: 'DELETE',
            data: JSON.stringify(obj),
            url: uri + 'Carts/DeleteProductFromCart',
            headers: { 'Content-Type':'application/json' }
        }).then(function successCallBack(successResponse) {
            console.log(successResponse.data);
        }), function errorCallBack(errorResponse) {
            console.log(errorResponse.data);
        };
    }
    return {
        Delete: Delete
    };
}]);
