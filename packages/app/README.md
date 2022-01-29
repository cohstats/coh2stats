# Coh2 match stats app

An application that can show you stats of players you are playing with/against.

## How it works

In regular intervals this app checks the `warnings.log` file for logs Coh2 generates. To make this as efficient as possible the app will read the log file in reverse and will stop when it found the first match starting logs. From these logs the app retrieves information about the players in the match. These are:
position, name, isAI, relicID and faction

Before the app continues getting more detailed information it will check if the found match is a new or different one from the match before. This is to minimize the strain on web APIs.

Then all additional information will be fetched with one single relic API request.

### Development

Once you have installed all dependencies. You can use
`yarn app start` for development.

To build the executable and an installer run `yarn app make`.
Your build will appear in the `out` folder.

### TODOs for the future

- Streamer mode
- Notification system improvement (currently notifications get suppressed when running a game)
- Add replay analysis
- Find leaderboard stats for ai games and custom games
- Button to take a screenshot that gets added to clipboard for sharing
- Close windows instead of hiding them to hopefully save memory
