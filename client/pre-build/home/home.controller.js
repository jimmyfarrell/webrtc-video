app.controller('HomeController', function($scope, $http, $sce, User) {

    var myStream;
    $scope.callId = '';
    $scope.myId = '';
    $scope.video = '';
    $scope.user = '';

    $scope.connect = function(name){
        var peer = new Peer({key: 's5lw9do7zht1emi'});
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        navigator.getUserMedia({ audio: true, video: true }, function(stream) {
            myStream = stream;
        }, function(err) {
            console.log('There was an error. Surprise surprise.');
        });

        peer.on('open', function(id) {
            User.connect(id, $scope.user)
            .then(function(){
                $scope.myId = id;
            })
            .catch(console.log);
        });

        peer.on('call', function(call) {
            call.answer(myStream);
            showVideo(call);
        });
    };


    $scope.makeCall = function(callId) {
        var call = peer.call(callId, myStream);
        showVideo(call);
    };

    var showVideo = function(call) {
        console.log('peer.connections', peer.connections);
        call.on('stream', function(stream) {
            $scope.video = $sce.trustAsResourceUrl(URL.createObjectURL(stream));
            $scope.$digest();
        });
    };

});
