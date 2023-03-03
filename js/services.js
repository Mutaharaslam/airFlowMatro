'use strict';


app.factory('apiServices', ['$http', '$cookies', '$location', 
  function($http, $cookies, $location){
  	var apiPath = "http://metroairflow.com/api/api/";
  	//var apiPath = "http://metroairflow.com:5000/api/";
    var logged = false;
  	var apiServices = {

      setBasic: function(credential) {
          $http.defaults.headers.common['Authorization'] = 'Basic ' + credential;
      },
      getBasic: function() {
          return $http.defaults.headers.common['Authorization'];
      },

      setToken: function(token){
        $cookies.metroairflow = token;
      },

      removeToken: function(){
        delete $cookies["metroairflow"];
      },

      getToken: function(token){
        return $cookies['metroairflow'];
      },

      checkUserLoggedIn: function($scope, $location){
        $scope.loading = true;
        var token = apiServices.getToken();
        if(apiServices.isAuthenticated()){
           $scope.loading = false;
        }
        else if(token)
          {
            apiServices.setBasic(btoa(token+':'));
            
            apiServices.verify(token).then(function(result){
              if(result)
              { 
                $scope.loading = false;
                apiServices.setAuthenticate();
              }
              else
              { 
                $scope.loading = false;
                $location.path('/login');
                apiServices.removeToken();
              }

            });
          } 
        else{
          $scope.loading = false;
          $location.path('/login');
        }

      },

      unAuthenticate: function() {
          logged = false;
      },

      setAuthenticate: function(){
          logged = true;

      },
      isAuthenticated: function(){
          return logged;
      },

  		getReviews: function() {
          return $http
            .get(apiPath + 'reviews')
            .then(function(res) {
                return res.data;
              },
              function(res) {
                return false;
              });
      },

      getInvoices: function() {
          return $http
            .get(apiPath + 'invoice')
            .then(function(res) {
                return res.data;
              },
              function(res) {
                return false;
              });
      },


      contact: function(contactForm) {
          return $http
            .post(apiPath + 'contact', JSON.stringify(contactForm))
            .then(function(res) {
                return res.data;
              },
              function(res) {
                return false;
              });
      },

      newInvoice: function(invoiceData) {
          return $http({
            method: 'POST',
            url: apiPath + 'invoice',
            data: invoiceData,
             headers:{'Content-Type':undefined}})
            .then(function(res) {
                return res.data;
              },
              function(res) {
                return false;
              });
      },

      verify: function(){
          return $http
            .post(apiPath + 'verify')
            .then(function(res) {
                return true;
              },
              function(res) {
                return false;
              });
      },

      acquireToken: function(credential) {
          return $http
            .post(apiPath + 'token')
            .then(function(res) {
                return res.data;
              },
              function(res) {
                return false;
              });
      },

      sendEmail: function(){
          return $http
            .post(apiPath + 'contact')
            .then(function(res) {
                return true;
              },
              function(res) {
                return false;
              });
      }
    }


    return apiServices
}]);
