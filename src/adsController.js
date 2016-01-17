function adsController ($scope, authService)
{
    $scope.auth = authService;
    $scope.ads = [];
    $scope.ad = {};
    console.log("running ads controller");

    authService.getAds()
    .then(res => {
        var ads = res.data;
        $scope.ads.push(...ads);
    })
    .catch(err => {
        console.error(err);
    });

    $scope.submit = function() {
        return authService.postAd($scope.ad)
           .then(res => {
                var ad = res.data; 
                $scope.ads.push(ad);
                $scope.ad = {};
           }).catch(err => {
                console.error(err);
           }); 
    };
}

module.exports = adsController;
