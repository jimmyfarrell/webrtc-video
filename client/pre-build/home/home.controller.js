app.controller('HomeController', function($scope, $http, $sce, User) {

    var myStream;
    $scope.callId = '';
    $scope.myId = '';
    $scope.video = '';
    $scope.user = '';

    var peer;

    $scope.connect = function(name){
        peer = new Peer({key: 's5lw9do7zht1emi'});

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
        User.getOne($scope.myId)
        .then(function(randoId){
            var call = peer.call(randoId, myStream);
            showVideo(call);
        });
    };

    var showVideo = function(call) {
        console.log('peer.connections', peer.connections);
        call.on('stream', function(stream) {
            $scope.video = $sce.trustAsResourceUrl(URL.createObjectURL(stream));
            $scope.$digest();
        });
    };

});
