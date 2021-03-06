# Made by ramp
import os
import xml.etree.ElementTree as ET
import pandas as pd

path ="D:\SteamLibrary\steamapps\common\Company of Heroes 2 Tools\assets\data\attributes\instances\commander"

myCategoryDirs = os.listdir(path)
myDict = []
for categories in myCategoryDirs:
    print(path+'\\'+categories)
    for root, dirs, files in os.walk(path+'\\'+categories):
        for file in files:
            if(file.endswith(".xml")):

                sXmlPath = root+'\\'+file
                # open XML file *.Content
                tree = ET.parse(sXmlPath)
                xmlroot = tree.getroot()
                # get all elements containing text attribute
                xmlResult = xmlroot.findall('.//*uniqueid')
                for element in xmlResult:
                    nServerID = element.attrib['value'] #get a value of serverID

                # create a dictionary record
                myDict.append({'race':categories,'commander':os.path.splitext(file)[0],'serverID':nServerID})


# convert list of dict to dataframe and convert to CSV
frame = pd.DataFrame(myDict)
myResult = frame.to_csv(index=False)
# finally save file
with open("C:\commander\myCsvResult.txt", "w") as text_file:
    text_file.write(myResult)
