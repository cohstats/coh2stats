import os
import json
import xml.etree.ElementTree as ET
import pandas as pd
import itertools 

# -*- coding: utf-8 -*-
# this script reads thru swf.xml to obtain

# //////////////// 1 ////////////////////////
# files names and their ID
# file example
# <item bitmapFormat="13" characterId="589872" exportName="BoBDialogs_Dossier_Divider_880x24" fileName="CoH2UI_I442.tga" targetHeight="2048" targetWidth="2024" type="DefineExternalImage2"/>


# //////////////// 2 ////////////////////////
# sub images
# subimage example
# <item characterId="10" imageCharacterId="86" type="DefineSubImage" x1="1376" x2="1876" y1="412" y2="452"/>


# //////////////// 3 ////////////////////////
# symbol class has item

    # <item type="SymbolClassTag">
    #   <tags>
    #     <item>83</item>
    #     <item>84</item>
    #     <item>100</item>
    #     <item>0</item>
    #   </tags>
    #   <names>
    #     <item>LabelDefault</item>
    #     <item>BoBTooltips_Button_Customizer_Unselected_84x84</item>
    #     <item>LabelPTSerifBoldLeft40White</item>
    #     <item>Icons_abilities_ability_west_german_kubelwagen_camouflage</item>
    #     <item>Tooltips_Tooltip_Title_560x44</item>
    #     <item>COH2UI</item>
    #   </names>
    # </item>
    
 #%% CELL preparing XML tree 
print('starting') 
xmlPath = 'C:/Users/Acer/Desktop/assetBrowser/poks/swf.xml'
tree = ET.parse(xmlPath)
xmlroot = tree.getroot()
print('done preparing XML tree ') 
    
    
#%% CELL get symbolClass names and tags 
symbolClassDict = {}
    
symbolClassTags  = xmlroot.findall(".//*[@type='SymbolClassTag']/tags/item")
symbolClassNames = xmlroot.findall(".//*[@type='SymbolClassTag']/names/item")

for tag,name in zip(symbolClassTags,symbolClassNames):
    symbolClassDict[tag.text] = name.text
print('done get symbolClass names and tags ')


#%% CELL get image definitions
imageDataDict = {}
imageDataXml  = xmlroot.findall(".//*[@type='DefineExternalImage2']")
for image in imageDataXml:
    charIdToInt = int(image.attrib['characterId'])
    # extract the last 2 HEX digits and treat them as integer. This is used in subImages as imageCharacterId
    convertedID = (int(hex(charIdToInt)[-2:],16)) 
    # add dictionary entry
    imageDataDict[str(convertedID)] = image.attrib
    

#%% CELL get DefineSubImages
subImageDict = {}
subImageDataXml  = xmlroot.findall(".//*[@type='DefineSubImage']")
for subImage in subImageDataXml:
    subImageDict[subImage.attrib['characterId']] = subImage.attrib



#%% CELL export
# Finally, export our results into JSON files for further processing

with open('symbolClassDict.json', 'w', encoding='utf-8') as f:
    json.dump(symbolClassDict, f, ensure_ascii=False, indent=4)
    
with open('imageDataDict.json', 'w', encoding='utf-8') as f:
    json.dump(imageDataDict, f, ensure_ascii=False, indent=4)
    
with open('subImageDict.json', 'w', encoding='utf-8') as f:
    json.dump(subImageDict, f, ensure_ascii=False, indent=4)
    
#%% CELLtesting

print(imageDataDict['24']['exportName'])
