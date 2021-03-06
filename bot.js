console.log('NodeFTW Bot is Running...');

var twit = require('twit');
var authKey = require('./twitAuth.js');

var T = new twit(authKey);
// var stream = T.stream('user');

var targetUsername = '';
if (process.argv[2]) {
  targetUsername = process.argv[2];
}
if (process.argv[2] === 'NodeFTW' && process.argv[3] === 'clean') {
  console.log('Destroying all bot tweets!')
  cleanStatuses();
} else {
  console.log('Targeting User: '+process.argv[2]);
  runBot();
}

/* Get request based on search query */
// T.get('search/tweets', {
//   q: 'Foki since:2017-11-11',
//   count: 10,
// }, ((err, data, response) => {
//   // console.log(data);
//   let tweets = data.statuses;
//   for (let tweet in tweets) {
//     console.log(tweets[tweet].text);
//   }
// }));

/* Get request based on username */
// T.get('statuses/user_timeline', {
//   screen_name: 'Imperator_Jake',
//   count: 1,
// }, ((err, data, response) => {
//   console.log(data);
//   // for (let tweet in data) {
//   //   console.log(data[tweet].text);
//   // }
// }));

/* Basic Post Request/TWEET */
// T.post('statuses/update', {
//   status: 'Can we all take a moment to appreciate #NodeJS',
// }, ((err, data, response) => {
//   if (err) {
//     console.log('Something went wrong:\n', err);
//   } else {
//     console.log('TWEET POSTED!!!');
//   }
// }));

/* Initial tweet function mockup */
// function submitTweet() {
//   T.post('statuses/update', {
//     status: 'Random Number Test: Here is a random number: '+
//             Math.floor(Math.random()*5000)+' #NodeJS'
//   }, ((err, data, response) => {
//     if (err) {
//       console.log('Something went wrong:\n', err);
//     } else {
//       console.log('TWEET POSTED!!!');
//     }
//   }));
// }
//

/* Function for posting tweets based on the string tweetData */
function submitTweet(tweetData) {
  T.post('statuses/update', {
    status: tweetData
  }, ((err, data, response) => {
    if (err) {
      console.log('Something went wrong:\n', err);
    } else {
      console.log('TWEET POSTED!!!');
    }
  }));
}

/* Function for posting tweets based on the string tweetData
   as a reply to the tweet specified by the string replyId */
function submitTweetReply(tweetData, replyId) {
  T.post('statuses/update', {
    status: tweetData,
    in_reply_to_status_id: replyId,
  }, ((err, data, response) => {
    if (err) {
      console.log('Something went wrong:\n', err);
    } else {
      console.log('TWEET POSTED!!!');
    }
  }));
}

/* Function for liking tweets based on the string tweetId */
function likeTweet(tweetId) {
  T.post('favorites/create', {
    id: tweetId
  }, ((err, data, response) => {
    if (err) {
      console.log('Something went wrong:\n', err);
    } else {
      console.log('TWEET LIKED!!!');
    }
  }));
}

/* Function for retweeting a tweet based on the string tweetId */
function retweet(tweetId) {
  T.post('statuses/retweet/:id', {
    id: tweetId
  }, ((err, data, response) => {
    if (err) {
      console.log('Something went wrong:\n', err);
    } else {
      console.log('RETWEET SUCCESSFUL !!!');
    }
  }));
}

/* Stream that will thank new followers in real time */
// stream.on('follow', (data) => {
//   var name = data.source.name;
//   var screenName = data.source.screen_name;
//   console.log(screenName+' just created a follow event!');
//   submitTweet('.@'+screenName+
//               ' Thanks for the follow!');
// });

/* Stream that will reply to @ tweets in real time */
// stream.on('tweet', (data) => {
//   if (data.in_reply_to_screen_name === 'NodeFTW') {
//     submitTweet(('@'+data.user.screen_name+' '+
//                   responses[Math.floor(Math.random()*6)]+
//                   ' btw your lucky number is: '+
//                   Math.floor(Math.random()*5000)
//                 ));
//     console.log(data.in_reply_to_screen_name+' Has tweeted '+
//                 data.text+' at the bot! The bot has replyed!');
//   }
// });

/* Main Bot Code
  - searches for user
  - if found starts a stream to the twitter api */
function runBot() {
  T.get('users/show', {
    screen_name: targetUsername,
    }, ((err, data, response) => {
      if (err) {
        console.log('Something went wrong:\n',err);
      }
      if (data.id_str) {
        console.log('User Found! Beginning bot protocol!');
        startStream(data.id_str);

        // Running this sort of function is how you get banned xD
        // setInterval(() => {submitTweet(
        //   '.@'+targetUsername+' What\'s up? '+emoticons[Math.floor(Math.random()*6)]+
        //   ' btw your luck number is: '+Math.floor(Math.random()*5001));
        // }, 1000*5);

      }
  }));
}

/* Stream that will like, retweet, and reply to any tweets
   created by the specified user in real time */
function startStream(userID) {
  var stream = T.stream('statuses/filter', { follow: userID });

  stream.on('tweet', (tweet) => {
    if (tweet.user.id_str === userID) {
      console.log('Responding to tweet:\n'+tweet.text+
                  '\n-------------------------------');
      submitTweetReply(('@'+tweet.user.screen_name+' '+
                        responsesForReply[Math.floor(Math.random()*6)]+
                        ' '+emoticons[Math.floor(Math.random()*6)]
                        +' btw your lucky number is: '+
                        Math.floor(Math.random()*5000)
                       ), tweet.id_str);
      console.log('Reply Sent!');
      likeTweet(tweet.id_str);
      console.log('Like Sent!');
      retweet(tweet.id_str);
      console.log('Retweet Sent!'+
                  '\n-------------------------------');
    }
  });
}

var responses = [
  'Thank you for tweeting at me!',
  'I\'m not sure how I feel about your tweet!',
  'Please refrain from sending me messages like this!',
  ':^) I think you\'re cute!',
  'There\'s nothing like a conversation with an Autonomous machine!',
  'Your input is greatly appreciated on the subject xD'
];

var responsesForReply = [
  'Wow much CONTENT! I really enjoyed this one!',
  'I\'m not sure how I feel about this!',
  'OMG I love your perspective bro!',
  ':^) I\'m your biggest fan!',
  'There\'s nothing like a conversation with an autonomous machine!',
  'Berry Good! I couldn\'t have said it better myself!'
];

var emoticons = [
  '(☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)',
  '▔\▁(ヅ)▁/▔',
  '\(ˆ▽ˆ)/',
  '(ﾉ °益°)ﾉ 彡 ┻━┻',
  '┻━┻ ︵ヽ(`□´)ﾉ︵﻿ ┻━┻',
  '〜(￣▽￣〜)(〜￣▽￣)〜'
];

/* Function for cleaning up the bot's tweets */
async function cleanStatuses() {
  var tweetsExist = true;
  while (tweetsExist) {
    var tweetsArray = await findTweets();
    if (tweetsArray.data.length === 0) {
      console.log('ALL DONE!');
      tweetsExist = false;
    } else {
      console.log('Deteting Tweet: ', tweetsArray.data[0].text);
      await deleteMostRecentTweet(tweetsArray.data[0].id_str);
    }
  }
}

/* Function for finding tweets to delete */
function findTweets() {
  return T.get('statuses/user_timeline', {
    screen_name: targetUsername,
    count: 1,
  },  (err, data, response) => {
    if (err) {
      console.log('Something went wrong! ', err);
    }
  });
}

/* Function for deleting a tweet specified by the string tweetID */
function deleteMostRecentTweet(tweetID) {
    return T.post('statuses/destroy/:id', {
      id: tweetID
    }, (err, data, response) => {
      if (err) {
        console.log('Something went wrong in deletion! ', err);
      }
      console.log('Tweet deleted successfully!');
    });
}
