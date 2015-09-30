import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let client = redis.createClient();


client.hset("webRTC", "1002", "Christian", redis.print);
client.hset("webRTC", "1001", "Jimmy", redis.print);

client.hgetallAsync('webRTC')
.then(function(users){
    console.log(users);
});
