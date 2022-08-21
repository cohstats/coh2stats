# README
# This script removes duplicate words (seperated by underscore "_" ) from the filenames of sourceDir.
# It also removes the leftover underscores.
# The original files are kept intact in sourceDir.
# The copied + renamed files are available in targetDir.

# example:  original    - 6_8_brody_6_8_brody_x300.webp
#           result      - 6_8_brody_x300.webp

# modify the following directory names to your needs.
sourceDir = "originals"
targetDir = "renamed"

import os
import re
from shutil import copyfile
from os import listdir
from os.path import isfile, join
from collections import Counter


# get the original file names from source directory
original_names = [f for f in listdir(sourceDir) if isfile(join(sourceDir, f))]
new_names = []

for name in original_names:
    
    new_name = name    
    # find all words separated by underscore (underscore not included in result regex group)
    groups = re.findall("(.+?)(?:_)", name)
    
    # dictionary of occurences of each word
    occurences = Counter(groups)
    
    for word in occurences:
        #print(word + " has occured " + str(occurences[word]) + " times")
        for i in range(1,occurences[word]):
            new_name = new_name.replace(word, '',1)
                 
    # make sure we remove all underscore clutter
    while True:
        old_name = new_name
        new_name = new_name.replace('__', '_',1)
        if old_name == new_name:
            break
    if new_name[0] == '_':
        new_name = new_name.replace('_', '',1)
        
    # append new result
    new_names.append(new_name)
    
# zip the lists together in a dictionary. Original name is key, new name is value
zipped = dict(zip(original_names, new_names))

# create a new dir if needed
if not os.path.exists(targetDir):
    os.mkdir(targetDir)

# pretty path
sourcePath = os.path.join(os.getcwd(), sourceDir)
targetPath = os.path.join(os.getcwd(), targetDir)

for original, new in zipped.items():
    # try to copy and rename all files.
    dest = copyfile(os.path.join(sourcePath,original), os.path.join(targetPath,new))

