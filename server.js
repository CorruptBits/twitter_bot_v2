require('dotenv').config()

const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const stream = client.stream('statuses/filter', {follow: '*******, *******, ********, *******, ******'});

const users = ['******', '*********', '**********', '*********', '*********'];
let tweets = [];
let usernames = [];
let points = [];
let message = '';

const getUsers = async () => {
  for(let i = 0; i < users.length; i++) {
    const data = await client.get('statuses/user_timeline', {screen_name: users[i]});
    tweets.push({username: data[0].user.screen_name, count: data[0].user.statuses_count});
  }
}

stream.on('data', async event => {
  getUsers().then(() => {
    tweets.sort((a, b) =>
    {
      return b.count-a.count
    });

    tweets.forEach(element => {
      usernames.push(element.username);
      points.push(element.count);
    });

    message = `TOP5
1.@${usernames[0]} - ${points[0]}🏆
2.@${usernames[1]} - ${points[1]}🥈
3.@${usernames[2]} - ${points[2]}🥉
4.@${usernames[3]} - ${points[3]}
5.@${usernames[4]} - ${points[4]}`
  
  client.post('statuses/update', {status: `${message}`});
  console.log('TWEET SENT!');
  });
});
