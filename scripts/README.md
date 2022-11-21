# Random helper scripts
1 time scripts mostly used to process and extract COH data

```
cc2sga.exe "S:\SteamLibrary\steamapps\common\Company of Heroes 2\CoH2\Archives\UIHigh.sga" current
```

Use asset browser https://www.coh2.org/topic/30322/tool-coh2-ui-asset-browser  
Open file `ui/bin/coh2ui.gfx` in exported files

Export all images out of it. Merge to one folder  `mv **/* .` 

----
Useful guide https://www.coh2.org/topic/108687/guide-merge-the-patch-with-outdated-tools

----
RGDTools

## How to extract the current game data
1. Download COH2 Tools - steam
2. Open the Tools. In top menu, Click on Tools -> open Archive viewer
3. In Archive Viewer Open file `S:\SteamLibrary\steamapps\common\Company of Heroes 2\CoH2\Archives\AttribArchive.sga`
4. Extract commander folder (or any folder where the files you are looking for) --> this will give you .rgd files
5. Create folder `in` put the .rgd files inside
6. Download RGDTools_v1.3.7z, extract it 
7. Run `rgdConv.exe hash_dict.txt in out -x` to get .xml files or without the -x to get .txt files


## How to extract sound files
1. Download COH2 Tools - steam
2. Open the Tools. In top menu, Click on Tools -> open Archive viewer
3. In Archive Viewer Open file `S:\SteamLibrary\steamapps\common\Company of Heroes 2\CoH2\Archives\SoundHigh.sga`
4. Extract the files
5. You will get `.smf` files
6. Open the file HEX editor, for example https://hexed.it/
7. Delete the first 16 bytes (first line)
8. Save the file as .wav and play it

