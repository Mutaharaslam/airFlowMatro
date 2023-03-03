
var app = angular.module('app', [
  'ngRoute',
  'ngCookies',
  'ui.grid',
  'ngLoader',
  'ngFileUpload'
]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", {templateUrl: "partials/home.html", controller: "HomeController"})
    .when("/services", {templateUrl: "partials/schedule.html", controller: "ScheduleController"})
    //CONTACT
    .when("/services/estimate", {templateUrl: "partials/estimate.html", controller: "ScheduleController"})
    .when("/services/repair", {templateUrl: "partials/repair.html", controller: "ScheduleController"})
    .when("/services/maintenance", {templateUrl: "partials/maintenance.html", controller: "ScheduleController"})
    .when("/services/contact", {templateUrl: "partials/contact.html", controller: "ScheduleController"})

    //ADMIN
    .when("/login", {templateUrl: "templates/login.html", controller: "LoginController"})
    .when("/admin", {templateUrl: "partials/admin.html", controller: "AdminController"})
    .when("/admin/invoice/service", {templateUrl: "partials/serviceinvoice.html", controller: "ServiceInvoiceController"})
    .when("/admin/invoice/manage", {templateUrl: "partials/reviewinvoice.html", controller: "ManageInvoiceController"})
    .when("/admin/invoice/installation", {templateUrl: "partials/installinvoice.html", controller: "InstallationInvoiceController"})
    .when("/admin/reviews", {templateUrl: "partials/managereview.html", controller: "AdminController"})

    //MISC
    .when("/faq", {templateUrl: "partials/faq.html", controller: "FaqController"})
    .when("/about", {templateUrl: "partials/about.html", controller: "AboutController"})
    .when("/reviews", {templateUrl: "partials/contact.html", controller: "ReviewController"})
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

app.controller('HomeController', ['$scope', '$http', 'apiServices','$location',
    function($scope, $http, apiServices ,$location){
      apiServices.getReviews().then(function(result){
        console.log(result);
      });
    }
]);

app.controller('ServiceInvoiceController', ['$scope', '$http', 'Upload', '$timeout',  'apiServices', '$cookies', '$location',
    function($scope, $http, Upload, $timeout, apiServices, $cookies, $location){
      

        apiServices.checkUserLoggedIn($scope,$location);
        $scope.files = [];

        $scope.logout = function(){
            $location.path('/login');
            apiServices.removeToken();
            apiServices.unAuthenticate();
        }

        $scope.uploadFiles = function(files, errFiles) {
            $scope.errFiles = errFiles;
            $scope.files = files;

         }

        $scope.addAccessory = function() {
            $scope.invoice.accs.push({desc:""});    
        }


        $scope.removeAccessory = function(item) {
            $scope.invoice.accs.splice($scope.invoice.accs.indexOf(item), 1);    
        }


       $scope.invoice = {
          invoice_type: "installation_invoice",
          scopeofwork: "",
          proposal_accepted_by: "",
          proposal_accepted_by_date: "",
          sales_representative_date: "",
          sales_representative: "",
          notes: "",
          total_installed_price: "",
          customer_info:  {name: "", web_link: "",cell: "",  address: "", city: "", state: "", phone: "", postal: "", email: ""},
          brand: {ac:"", coil:'', furnace:""},
          model: {ac:"", coil:'', furnace:""},
          rating: {ac:"", coil:'', furnace:""},
          accs: (()=>{x = [];  for (var i = 0; i < 3; i++) x.push({desc: ""}); return x; })()
        };

        $scope.submit = function(){
            $scope.invoice.total_installed_price = $scope.invoice.total_installed_price.replace(/[^\d.-]/g, '');
            var form = new FormData();
            angular.forEach($scope.files,function(file){
                        form.append('file',file, file.name);
            });
            form.append('formdata', JSON.stringify($scope.invoice));
            console.log(form);
            apiServices.newInvoice(form).then(function(result){
              alert(result.data);
            });
        }

         $scope.clearLocalStorage = function(){
          var confirmClear = confirm("Are you sure you would like to clear the invoice?");
          if (confirmClear){
            $scope.files = [];
            $scope.errFiles = [];
            $scope.invoice = {
              invoice_type: "installation_invoice",
              scopeofwork: "",
              notes: "",
              proposal_accepted_by: "",
              proposal_accepted_by_date: "",
              sales_representative_date: "",
              sales_representative: "",
              total_installed_price: "",
              customer_info:  {name: "", web_link: "",cell: "",  address: "", city: "", state: "", phone: "", postal: "", email: ""},
              brand: {ac:"", coil:'', furnace:""},
              model: {ac:"", coil:'', furnace:""},
              rating: {ac:"", coil:'', furnace:""},
              accs: []
            };
           }


         }
    }
]);


app.controller('InstallationInvoiceController', ['$scope', '$http', 'apiServices', '$cookies', '$location',
    function($scope, $http, apiServices, $cookies, $location){
      
        apiServices.checkUserLoggedIn($scope,$location);
        $scope.files = [];

        $scope.logout = function(){
            $location.path('/login');
            apiServices.removeToken();
            apiServices.unAuthenticate();
        }



        $scope.uploadFiles = function(files, errFiles) {
            $scope.errFiles = errFiles;
            $scope.files = files;

         }

       $scope.invoice = {
          invoice_type: "service_invoice",
          user_email: "",
          note: "",
          total: "",
          paid: "",
          balance: "",
          technician: "",
          customer_info:  {name: "", web_link: "", address: "", city: "", state: "", phone: "", postal: "", email: ""},
          scopeofwork: "",
          part: "",
          labor: "",
          company_info:  {name: "Atlanta Metro Airflow Service LLC",  address1: "3955 Dalwood Drive", address2: "Suwanee, GA 30024", phone: "(770) 844-5841"},
            units:[ {make:"", model:'', serial:""}],
            works: ""
        };

        for(var i = 0; i<2; i++){
          $scope.invoice.units.push({make:"", model:'', serial:""});
        }

        $scope.submit = function(){
            $scope.invoice.total = $scope.invoice.total.replace(/[^\d.-]/g, '');
            var form = new FormData();
            angular.forEach($scope.files,function(file){
                        form.append('file',file, file.name);
            });
            form.append('formdata', JSON.stringify($scope.invoice));
            apiServices.newInvoice(form).then(function(result){
              alert(result.data);
            });
        }
 
        
      
        $scope.addUnit = function() {
            $scope.invoice.works.push({description:"", material:0.00, labor:0.00});    
        }


        $scope.removeUnit = function(item) {
            $scope.invoice.units.splice($scope.invoice.units.indexOf(item), 1);    
        }

        $scope.clearLocalStorage = function(){
          var confirmClear = confirm("Are you sure you would like to clear the invoice?");

        if (confirmClear){
            $scope.files = [];
            $scope.errFiles = [];
       $scope.invoice = {
          invoice_type: "service_invoice",
          user_email: "",
          scopeofwork: "",
          total: "",
          note: "",
          technician: "",
          customer_info:  {name: "", web_link: "", address: "", city: "", state: "", phone: "", postal: "", email: ""},
          part: "",
          labor: "",
          company_info:  {name: "Atlanta Metro Airflow Service LLC",  address1: "3955 Dalwood Drive", address2: "Suwanee, GA 30024", phone: "(770) 844-5841"},
            units:[ {make:"", model:'', serial:""}],
            works: ""
        };


        for(var i = 0; i<2; i++){
          $scope.invoice.units.push({make:"", model:'', serial:""});
        }
        }}
    }
]);

app.controller('AdminController', ['$scope', '$http', 'apiServices', '$cookies', '$location',
    function($scope, $http, apiServices, $cookies, $location){
        
        apiServices.checkUserLoggedIn($scope,$location);
        $scope.logout = function(){
            $location.path('/login');
            apiServices.removeToken();
            apiServices.unAuthenticate();
        }


    }
]);

app.controller('ManageInvoiceController', ['$scope', '$http', 'apiServices', '$cookies', '$location',
    function($scope, $http, apiServices, $cookies, $location){
      
        apiServices.checkUserLoggedIn($scope,$location);
        $scope.invoiceColumns = [{
            field: 'invoiceId',
            name: 'Id',
            width: '7.5%'},
        {
            field: 'invoiceType',
            name: 'Type',
            width: '10%'
        }, {
            field: 'customerName',
            name: 'Sent To',
            width: '30%'
        }, {
            field: 'dateObj',
            name: 'Date',
            width: '30%',
            cellFilter: 'date:"yyyy-MM-dd"'
        }, {
            field: 'invoiceTotal',
            width: '17.5%',
            name: 'Total'
        },
        {
            field: 'invoiceLocation',
            name: 'View',
            width: '10%',
            cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a target="_blank" ng-href="{{COL_FIELD}}" class="fa fa-file-pdf-o blue"></a></div>'
        }
        ];

        $scope.invoiceGrid = {            
            columnDefs: $scope.invoiceColumns,
            multiSelect: false,
            data: [],
            paginationPageSizes: [25, 50, 75, 100],
            paginationPageSize: 25,
            enableGridMenu: true,
            enableSelectAll: true,
           //exporterCsvFilename: 'myFile.csv',
            exporterMenuPdf:false,         

            //function fired twice, on row change
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        
        $scope.logout = function(){
            $location.path('/login');
            apiServices.removeToken();
            apiServices.unAuthenticate();
        }
        apiServices.getInvoices().then(function(existingInvoices){
            $scope.invoiceGrid.data = existingInvoices.data;
        });


    }
]);

app.controller('LoginController', ['$scope', '$http', '$cookies', 'apiServices', '$location',
  function($scope, $http, $cookies, apiServices, $location){
      if(apiServices.isAuthenticated()){
          $location.path('/admin');
      }
      $scope.loading = false;
      

      $scope.submit = function() {
            var credentials = btoa($scope.user + ':' + $scope.pass);
            $scope.loading = true;
            apiServices.setBasic(credentials);

            //Ask for a token
            if($scope.remember){
              apiServices.acquireToken(credentials).then(function(result)
              { 

                  $scope.loading = false;
                  if(!result)
                  {
                    alert("faliure to login");
                  }
                  else
                  {
                    apiServices.setToken(result.token);
                    apiServices.setAuthenticate();
                    $location.path('/admin');
                  }
              });
            }
            else{
              apiServices.verify(credentials).then(function(result)
              {   
                  $scope.loading = false;
                  if(!result)
                  {
                    alert("faliure to login");
                  }
                  else
                  {
                    apiServices.setAuthenticate();
                    $location.path('/admin');
                  }

              });

            }
            
      } 
    }
]);


function HeaderController($scope, $location) 
{ 
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}

  
app.controller('ScheduleController', ['$scope', '$http', 'apiServices', '$location',
  function($scope, $http,  apiServices, $location){
        $scope.serviceType = "";
        $scope.serviceDate = "";
        $scope.serviceTime = "";
        $scope.name = "";
        $scope.number = "";
        $scope.email = "";
        $scope.comment = "";
        $scope.submit = function(){
               console.log($scope.serviceType, $scope.serviceDate, $scope.serviceTime);
               $scope.contactForm = {
                  serviceType: $scope.serviceType,
                  serviceDate: $scope.serviceDate,
                  serviceTime: $scope.serviceTime,
                  name: $scope.name,
                  number: $scope.number,
                  email: $scope.email,
                  comment: $scope.comment
                  }
            apiServices.contact($scope.contactForm).then(function(result){
               if(result)
                  alert(result.data);
               else
                  alert("There was an issue submitting your inquiry. Please double check and try again.");
            });
        }
    }
]);

