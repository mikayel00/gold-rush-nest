# Gold Rush game

## Description
*“Gold Rush” is an in game event that allows for some competitive play. It begins at a specified time and concludes after a designated period. During that period players are added into so-called temporary buckets of 200 people, where they compete together for rewards. Players collect gold by tapping on gold nuggets in the game. The more you tap, the more gold you collect. Every 15 seconds the client will report to the backend endpoint the total number of gold collected. The leaderboard is shown to everyone with the gold amounts for each player in their “bucket”. When the event ends, rewards are given to all participants based on their standing in the leaderboard.*


## Pre requirements
```
Node version >= 20.6.0
```

## Installation

```bash
# Clone the repository via SSH
$ git clone git@github.com:mikayel00/gold-rush.git

# Or via HTTPS
$ git clone https://github.com/mikayel00/gold-rush.git

# Create Environment variables file and set your own data
$ cp .env.example .env

# Install dev and prod dependencies
$ npm install
```

## Running the app

```bash
# run the app
$ npm run start:dev
```

## Documentation
```
### IMPORTANT ###

Auth route not working from documentation. 
For auth use directly this url:  http://localhost:3000/auth

After successful auth, this API will automatically set the cookie,
which you will use in the next requests.

Documentation URL:  http://localhost:3000/documentation
```

Author - [Mikayel Hovhannisyan](https://github.com/mikayel00)

