# Coh2 match stats app

An application that can show you stats of players you are playing with/against.

## How it works
In regular intervals this app checks the `warnings.log` file for logs Coh2 generates. To make this as efficient as possible the app will read the log file in reverse and will stop when it found the first match starting logs. From these logs the app retrieves information about the players in the match. These are:
position, name, isAI, relicID and faction

Before the app continues getting more detailed information it will check if the found match is a new or different one from the match before. This is to minimize the strain on web APIs. 

Then for each player in the match one request to the relic API is sent. These requests are enough to generate and display the detailed match stats.

### Development

Once you have installed all dependecies. You can use 
`yarn app start` for development.

To build the executable and an installer run `yarn app make`.
Your build will appear in the `out` folder.
