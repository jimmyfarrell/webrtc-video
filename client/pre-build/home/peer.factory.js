app.factory('User', function($http){
   return {
       getAll: function(){
           return $http.get('/peers')
           .then(function(res){
             return res.data;
           })
       },

       getOne: function (currentUser){
           return $http.get('/peers')
           .then(function(res){
               delete res.data[currentUser];
               var rand = Math.floor(Math.random() * Object.keys(res.data).length);
               return Object.keys(res.data)[rand];
           })
       },

       connect: function(id, user){
           return $http.post('/connect', {id, user})
           .then(function(res){
              return res.data;
           });
       }
   }
});