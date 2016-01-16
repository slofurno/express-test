function adsController ($scope, accountService)
{
    $scope.ads = [];
    $scope.ad = {};
    console.log("running ads controller");

    accountService.getAds()
    .then(res => {
        var ads = JSON.parse(res);
        $scope.ads.push(...ads);
        $scope.$apply();
        console.log("ads", $scope.ads);
    })
    .catch(err => {
        console.error(err);
    });

    $scope.submit = function() {
        return accountService.postAd($scope.ad)
           .then(x => {
                console.log(x);
                var ad = JSON.parse(x);
                $scope.ads.push(ad);
                $scope.ad = {};
                $scope.$apply();
           }).catch(err => {
                console.error(err);
           }); 
    };


}

module.exports = adsController;
