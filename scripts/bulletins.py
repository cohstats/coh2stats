# -*- coding: utf-8 -*-
import os
import json
import xml.etree.ElementTree as ET
import pandas as pd

# ////////////////////////////////////////////////////////////////////////////
# ////////////////////////////////////////////////////////////////////////////
# Constants and parameters
# ////////////////////////////////////////////////////////////////////////////
# ////////////////////////////////////////////////////////////////////////////
COH_TEXT_LIB_PATH = "D:/SteamLibrary/steamapps/common/Company of Heroes 2/CoH2/Locale/English/RelicCoH2.English.ucs" # file is utf16 encoded

COH_PATH_INSTANCES = 'D:/SteamLibrary/steamapps/common/Company of Heroes 2 Tools/assets/data/attributes/instances/'
COH_BULLETIN_PATH ="D:/SteamLibrary/steamapps/common/Company of Heroes 2 Tools/assets/data/attributes/instances/intel_bulletin"
COH_COMMANDER_PATH = "D:/SteamLibrary/steamapps/common/Company of Heroes 2 Tools/assets/data/attributes/instances/commander"

# hardcoded dictionary of race - to - race conversion
RACE_DICT = [{'raceIn':'racebps\german','raceOut':'wermacht'},
                {'raceIn':'racebps\soviet','raceOut':'soviet'},
                {'raceIn':'racebps\west_german','raceOut':'wgerman'},
                {'raceIn':'racebps\\aef','raceOut':'usf'},
                {'raceIn':'racebps\\british','raceOut':'british'}
                ]

# function returns raceId in a different format for frontend usage
def translateRaceID(RaceIn):
    for raceElement in RACE_DICT:
            if raceElement['raceIn'] == RaceIn:
                return (raceElement['raceOut'])

#function returns commander ability detail, use xml reference from source files as input
def parseAbilityDetails(referenceXml):

    # build XML path to file from directory + reference
    xmlPath = COH_PATH_INSTANCES+referenceXml+'.xml'
    xmlPath = xmlPath.replace('\\','/')

    tree = ET.parse(xmlPath)
    xmlroot = tree.getroot()

    abilityDetails = {}

    # look for ability name in localized strings
    locStrings = xmlroot.findall(".//*locstring/[@name='name']")
    try:
        textIndex = int(locStrings[0].attrib['value'])
        # print(textList.loc[textIndex].values[0])
        abilityDetails['name'] = (textList.loc[textIndex].values[0])
    except:
        abilityDetails['name'] = 'undefined'
        print('Cannot find a localized TMX entry for file ' + xmlPath + ' -> ' + str(textIndex) )

    # look for ability description in localized strings
    locStrings = xmlroot.findall(".//*locstring/[@name='description']")
    try:
        textIndex = int(locStrings[0].attrib['value'])
        # print(textList.loc[textIndex].values[0])
        abilityDetails['description'] = (textList.loc[textIndex].values[0])
    except:
        abilityDetails['description'] = 'undefined'
        print('Cannot find a localized TMX entry for file ' + xmlPath  + ' -> ' + str(textIndex))


    return abilityDetails

def parseCommanderRecord(xmlPath):
    # by default a record is empty. Prevent some fuckups
    myCommanderRecord = {}
    # get root element
    tree = ET.parse(xmlPath)
    xmlroot = tree.getroot()
    # get serverID
    xmlResult = xmlroot.findall('.//*uniqueid')
    myCommanderRecord['serverID'] = xmlResult[0].attrib['value']

    # get name
    locStrings = xmlroot.findall(".//*locstring/[@name='name']")
    try:
        textIndex = int(locStrings[0].attrib['value'])
        # print(textList.loc[textIndex].values[0])
        myCommanderRecord['commanderName'] = textList.loc[textIndex].values[0]
    except:
        myCommanderRecord['commanderName'] = 'undefined'

    # get description
    locStrings = xmlroot.findall(".//*locstring/[@name='description']")
    try:
        textIndex = int(locStrings[0].attrib['value'])
        # print(textList.loc[textIndex].values[0])
        myCommanderRecord['description'] = textList.loc[textIndex].values[0]
    except:
        myCommanderRecord['description'] = 'undefined'

    # look for assigned races
    xmlResult = xmlroot.findall(".//*[@name='race']")
    myRaceList = []
    for xmlRace in xmlResult:
        sRaceIn = (xmlRace.attrib['value'])
        myRaceList.append(translateRaceID(sRaceIn))
    myCommanderRecord['races'] = myRaceList

    # look for commander_ability
    xmlResult = xmlroot.findall(".//*[@name='commander_ability']")
    myAbilitiesList = []
    for xmlAbility in xmlResult:
        ability = {}
        # get ability reference for details
        details = parseAbilityDetails(xmlAbility.attrib['value'])
        ability['name'] = details['name']
        ability['description'] = details['description']

        myAbilitiesList.append(ability)


    myCommanderRecord['abilities'] = myAbilitiesList

    return myCommanderRecord

def parseBulletinRecord(xmlPath):
    # ////////////////////////////////////////////////////
    # parse XML data from a single file
    # input is an XML path to single intel bulletin description
    # ////////////////////////////////////////////////////
    # get root element
    tree = ET.parse(xmlPath)
    xmlroot = tree.getroot()

    # by default a record is empty. Prevent some fuckups
    myBulletinRecord = {}

    # check if this is a bulletin
    xmlResult = xmlroot.findall(".//*[@name='inventory_item_category']")
    # print((xmlResult[0].attrib['value'].find('intel_bulletin')) > 0)
    if ((xmlResult[0].attrib['value'].find('intel_bulletin')) < 0):
    # if item is not a bulletin, return empty data
        return

    # look for serverID
    xmlResult = xmlroot.findall(".//*[@name='server_id']")
    # print(xmlResult[0].attrib['value'])
    myBulletinRecord['serverID'] = xmlResult[0].attrib['value']

    # look for bulletin name
    locStrings = xmlroot.findall(".//*locstring/[@name='name']")
    textIndex = int(locStrings[0].attrib['value'])
    # print(textList.loc[textIndex].values[0])
    myBulletinRecord['bulletinName'] = textList.loc[textIndex].values[0]

    # look for description short
    locStrings = xmlroot.findall(".//*locstring/[@name='description']")
    textIndex = int(locStrings[0].attrib['value'])
    # print(textList.loc[textIndex].values[0])
    myBulletinRecord['descriptionShort'] = textList.loc[textIndex].values[0]

    # look for description long
    locStrings = xmlroot.findall(".//*locstring/[@name='description_short']")
    textIndex = int(locStrings[0].attrib['value'])
    # print(textList.loc[textIndex].values[0])
    myBulletinRecord['descriptionLong'] = textList.loc[textIndex].values[0]

    # look for icon path
    xmlResult = xmlroot.findall(".//*[@name='icon']")
    myBulletinRecord['IconPath'] = xmlResult[0].attrib['value']


    # look for assigned races
    xmlResult = xmlroot.findall(".//*[@name='race']")
    myRaceList = []
    for xmlRace in xmlResult:
        sRaceIn = (xmlRace.attrib['value'])
        myRaceList.append(translateRaceID(sRaceIn))

    myBulletinRecord['races'] = myRaceList

    return myBulletinRecord



# ///////////////////////////////////////////////////////////////////////
# # //////////////// Localization data
# ///////////////////////////////////////////////////////////////////////

textLibPath = COH_TEXT_LIB_PATH # file is utf16 encoded
# get textList entries
textList = pd.read_csv(textLibPath, encoding='UTF-16',delimiter='\t', header=None, skiprows = 1,
                 names = ['textID','textData'])
textList = textList.set_index('textID')


# ///////////////////////////////////////////////////////////////////////
# # //////////////// Intel bulletin data
# ///////////////////////////////////////////////////////////////////////

BulletinPath = COH_BULLETIN_PATH
# output data placed here
myBulletinData = list()
# prepare paths for all files
xmlPath = list()
# save all paths to to list xmlPath
for root, dirs, files in os.walk(BulletinPath):
    for file in files:
        xmlPath.append((root+'/'+file).replace('\\','/'))

# try to parse recordData from all XML files
for recordPath in xmlPath:
    recordData = parseBulletinRecord(recordPath)
    if recordData is not None:    #only append valid data
        myBulletinData.append(recordData)

# various format of data
myBulletinFrames = pd.DataFrame(myBulletinData)
myJsonBulletin = json.dumps(myBulletinData)

# /////////////////////////////////////////////////////////////////////////
# //////////////// commander data
# /////////////////////////////////////////////////////////////////////////

commanderPath = COH_COMMANDER_PATH
# output data placed here
myCommanderData = {}
# prepare paths for all files
xmlPath = list()
for root, dirs, files in os.walk(commanderPath):
    for file in files:
        xmlPath.append((root+'/'+file).replace('\\','/'))

# make a list of all commander records
for recordPath in xmlPath:
    commander = parseCommanderRecord(recordPath)
    myCommanderData[commander["serverID"]] = commander

# various format of data
myCommanderFrames = pd.DataFrame(myCommanderData)
myCommanderJson = json.dumps(myCommanderData)

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(myCommanderData, f, ensure_ascii=False, indent=4)



