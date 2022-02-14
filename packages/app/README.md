![grafik](https://user-images.githubusercontent.com/25324640/151676070-d293d944-3029-4ba9-a96f-13b391050c70.png)

# Coh2 Game Stats app

An application that can show you stats of players you are playing with/against.

## Features

- Easy to use, not configuration required
- Displays detailed leaderboard stats of players in your game
- Displays team stats
- Full player cards from https://coh2stats.com/ easily accessible
- Auto refreshes when a game is started
- [Overlay feature for streamers](#stream-overlay)
- Get notified when a game was found

![grafik](https://user-images.githubusercontent.com/25324640/151676338-67481e96-e138-466b-8188-ccb014568407.png)

## Installation

Download the installer from the releases page (todo: upload a release and paste a link here)

## Stream Overlay

An easy way to overlay player stats over your Coh2 game with OBS. There are two layout variants available:

- Top: Player stats will be shown under the vp ticker ![grafik](https://user-images.githubusercontent.com/25324640/151676111-21bf12c7-3d7b-4a97-b2e6-2d0df1c0a9a2.png)

- Left: Player stats will be shown on the left side of the screen ![grafik](https://user-images.githubusercontent.com/25324640/151676094-24aa5ea8-627d-4a4f-a068-26859ff03cbe.png)

Feel free to request a different layout in the repos issues.

This overlay **_changes its view dynamically based on the game state_**. **_If you are on the home screen / not in game, it will show nothing_**. When loading into a game ranks will be displayed inside the corresponding player card of the loading screen. When in game player stats will be shown under the vp counter or on the left side based on what you chose.

### Setup

Inside the Coh2 Game Stats app, go to settings and enable the streamer mode. Here you can also choose your preferred layout. When enabled the settings window will show you a url under the streamer mode port. Copy this url...

![grafik](https://user-images.githubusercontent.com/25324640/151676284-64c55322-a6b3-42d3-b375-69d438607021.png)

Inside OBS add a new source and choose browser. Paste the url inside the url field. Set the width and height according to your coh2 game resolution. In most cases 1920x1080.

![grafik](https://user-images.githubusercontent.com/25324640/151676229-e6934cfa-6bf1-445d-abe0-b4a8c2f0193c.png)

![grafik](https://user-images.githubusercontent.com/25324640/151676262-f84f3d07-e436-4ad1-b84f-2190d59895a7.png)

> The most important here is matching the aspect ratio to your game. E.g. If you are running your game in 4k you can still choose 1920x1080. Widescreen users will have to figure the resolution out themselfes.

Select Ok and adjust the browser layer to be on top of your game while also making sure both layers are perfectly on top of each other.

You are done! Happy streaming :)

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

#### Update mechanism

You need to update the version in `packages/app/package.json`.
The document which is checked for new version is located in `packages/web/public/electron-app-version.json` and this is
released to `coh2stats.com/electron-app-version.json`

When a new tag is done in master, new .exe installer is build to that release.

### TODOs for the future

- Notification system improvement (currently notifications get suppressed when running a game)
- Add replay analysis
- Find leaderboard stats for ai games and custom games
- Button to take a screenshot that gets added to clipboard for sharing
- Close windows instead of hiding them to hopefully save memory
- Change the Gif shown during installation to something better
