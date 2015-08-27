var app=angular.module('myApp',['infinite-scroll']);

app.controller('myCtrl', function($scope,productData,$http){
    $scope.display=[];
    $scope.style=false;
    $scope.toggle=function(){
        $scope.style=!$scope.style;
    }
    $scope.fullName="";
    $scope.shortName="";
    $scope.price="";
    $scope.imageUrl="";
    $scope.incomplete=true;
    $scope.index=-1;
    $scope.newItem=false;



    $scope.test = function(){
        $scope.incomplete = false;
        if (!$scope.fullName.length ||
            !$scope.shortName.length ||
            !$scope.price.length||
            !$scope.imageUrl.length) {
            $scope.incomplete = true;
        }
        console.log($scope.incomplete);
    };
    $scope.$watch('fullName', function() {$scope.test();});
    $scope.$watch('shortName', function() {$scope.test();});
    $scope.$watch('price', function() {$scope.test();});
    $scope.$watch('imageUrl', function() {$scope.test();});


    $scope.change=function(product){
        console.log(product);
        $scope.fullName=product.fullName;
        $scope.shortName=product.shortName;
        $scope.price=product.price;
        $scope.imageUrl=product.imageUrl;
        $scope.index=$scope.display.indexOf(product);
        $scope.newItem=false;
    }

    $scope.AddNew=function(){
        $scope.fullName="";
        $scope.shortName="";
        $scope.price="";
        $scope.imageUrl="";
        $scope.newItem=true;
    }


    $scope.save=function(){
        if(!$scope.newItem){
            if($scope.index!==-1){
                $scope.display[$scope.index].fullName=$scope.fullName;
                $scope.display[$scope.index].shortName=$scope.shortName;
                $scope.display[$scope.index].price=$scope.price;
                $scope.display[$scope.index].imageUrl=$scope.imageUrl;
                productData.editProduct($scope.index,$scope.display[$scope.index]);
            }
        }else{
            newItem={fullName:$scope.fullName,shortName:$scope.shortName,price:$scope.price,imageUrl:$scope.imageUrl};
            productData.createProduct(newItem);
            alert("New product added");
        }
        $scope.index=-1;
    }


    $scope.delete=function(){
        if($scope.index!==-1){
            $scope.display.splice($scope.index,1);
            productData.deleteProduct($scope.index);
        }
        $scope.index=-1;
    }


    $http.get("./products.json").success(function(response){
        productData.create(response.data);
        $scope.display=[];
        for(i=0;i<18;i++){
            if(productData.getByIndex(i)!=null){
                $scope.display.push(productData.getByIndex(i));
            }
        }
        console.log($scope.display);
    })



    $scope.loadMore=function(){
        var last=$scope.display.length-1;
        for(var i=1;i<=4;i++){
            if(productData.getByIndex(i)!=null){
                $scope.display.push(productData.getByIndex(last+i));
            }
        }
        console.log($scope.display);
    }
});


app.service('productData',function(){
    var products=[];
        return{
            create:function(data){
                products=data;
            },
            getProducts:function(){
                return products;
            },
            deleteProduct:function(index){
                products.splice(index,1);
            },
            createProduct:function(newProduct){
                products.push(newProduct);
            },
            editProduct:function(index,product){
                products[index]=product;
            },
            getByIndex:function(index){
                if(index<products.length) return products[index];
                else return null;
            }
        };
})
