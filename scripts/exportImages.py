import json
from PIL import Image
import os
from collections import defaultdict

# prepare data
# //////////////////////////////////////////////////
# read files
with open('subImageDict.json', 'r') as f:
    raw=f.read()
# parse file
subImageDict = json.loads(raw)

with open('symbolClassDict.json', 'r') as f:
    raw=f.read()
# parse file
symbolClassDict = json.loads(raw)

with open('imageDataDict.json', 'r') as f:
    raw=f.read()
# parse file
imageDataDict = json.loads(raw)


# commander and bulletin data
# ////////////////////////////////////////////////////
with open('commanderData.json', 'r', encoding='utf-8') as f:
    raw=f.read()
# parse file
commanderData = json.loads(raw)

with open('bulletinData.json', 'r', encoding='utf-8') as f:
    raw=f.read()
# parse file
bulletinData = json.loads(raw)





# subImageSelected = '10050', 48 49
def exportSingleImageByID(subImageSelected, exportedName, show = False):
    try:
        imageExportInstance = {}
        # print(exportedName)
        # retrieve subImage info
        # //////////////////////////////////////////////////
        imageExportInstance['subImage'] = subImageDict[subImageSelected]

        # retrieve image path
        # //////////////////////////////////////////////////
        OriginFileKey = subImageDict[subImageSelected]['imageCharacterId']
        imageExportInstance['originFile'] = imageDataDict[OriginFileKey]['fileName']

        # save the image
        # //////////////////////////////////////////////////

        # Opens a image in RGB mode
        pngPath = 'ui/assets/textures/'+ os.path.splitext(imageExportInstance['originFile'])[0].lower() +'.dds' #change the file extension, in datafiles *.dds is used
        im = Image.open(pngPath)

        # Setting the points for cropped image
        left = int(imageExportInstance['subImage']['x1'])
        top = int(imageExportInstance['subImage']['y1'])
        right = int(imageExportInstance['subImage']['x2'])
        bottom = int(imageExportInstance['subImage']['y2'])

        # Cropped image of above dimension
        # (It will not change orginal image)
        croppedImage = im.crop((left, top, right, bottom))

        # save the cropped image
        croppedImage.save('images/'+exportedName+".png")
        if show:
            croppedImage.show()
    except:
        print("Error opening the file " + pngPath)




# exportSingleImageByID('10050')
# exportSingleImageByID('10049')

# returns dictionary of subImages used in bulletins
BulletinSubImages = []
# iterate thru all bulletins
for bulletin in bulletinData.values():

    myIconPath = (bulletin['icon'])
    print(myIconPath)
    BulletinSubImages.append({'icon':myIconPath, 'id':symbolClassDict[myIconPath] })


# return dictionary of subImages of all commander and commander abilities
CommanderSubImages = []
for commander in commanderData.values():
    if commander['description'] != 'undefined':
        for ability in commander['abilities']:
            # print(ability['icon'])
            myIconPath = ability['icon']
            CommanderSubImages.append({'icon':myIconPath, 'id':symbolClassDict[myIconPath] })

    # print(commander['iconSmall'])
        myIconPath = commander['iconSmall']
        CommanderSubImages.append({'icon':myIconPath, 'id':symbolClassDict[myIconPath] })

        # print(commander['iconlarge'])
        myIconPath = commander['iconlarge']
        CommanderSubImages.append({'icon':myIconPath, 'id':symbolClassDict[myIconPath] })

    # print('///////////////////////////////////////////////////////////////////')

# finally, export all the subImages
for subImage in BulletinSubImages:
    # print(subImage['id'],subImage['icon'])
    exportSingleImageByID(subImage['id'],subImage['icon'])

print("bulletin images exported")

for subImage in CommanderSubImages:
    exportSingleImageByID(subImage['id'],subImage['icon'])

print("commander images exported")
