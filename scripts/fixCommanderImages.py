import json
import os
import xml.etree.ElementTree as ET

# Base relative path for commander data in repository
PATH = os.path.join('data', 'cu2021', 'commander')

# e.g. ['aef', 'british', 'german', 'soviet', 'west_german']
faction_dirs = os.listdir(PATH)

# Structure: {server_id: {'icon': 'example', 'icon_secondary': ''}}
parsed_xml_data = {}

# Get icons for each serverId from xml
for faction_dir_name in faction_dirs:
    entries = os.listdir(os.path.join(PATH, faction_dir_name))
    for entry in entries:
        file_path = os.path.join(PATH, faction_dir_name, entry)

        # Some pm directories exist that contain XMLs with empty icon values--skip those
        if os.path.isdir(file_path):
            continue

        tree = ET.parse(file_path)
        root = tree.getroot()
        server_id = ''
        icon = ''
        icon_secondary = ''
        try:
            file_data = root.find('Value').find('Data')
        except AttributeError:
            raise Exception(f'Malformed xml file: {file_path}')

        for element in file_data:
            if element.find('Key').text != 'commander_bag':
                continue

            for commander_bag_element in element.find('Data'):
                # server_id is nested under one more level
                if commander_bag_element.find('Key').text == 'server_item':
                    server_commander_bag_element_data = commander_bag_element.find('Data')
                    for node in server_commander_bag_element_data:
                        if node.find('Key').text == 'server_id':
                            server_id = node.find('Data').text
                            break

                # Ensure that null doesn't slip into the final JSON
                elif commander_bag_element.find('Key').text == 'icon':
                    icon = commander_bag_element.find('Data').text or ''
                elif commander_bag_element.find('Key').text == 'icon_secondary':
                    icon_secondary = commander_bag_element.find('Data').text or ''

        parsed_xml_data[server_id] = {'icon': icon, 'icon_secondary': icon_secondary}

with open('commanderData.json', 'r', encoding='utf-8') as f:
    commander_data = f.read()

commander_data = json.loads(commander_data)

# Update commander_data dict
for v in commander_data.values():
    server_id = v['serverID']
    updated_icons = parsed_xml_data.get(server_id, None)
    if updated_icons:
        # Note that the secondary icon is the large icon
        v.update({'iconSmall': updated_icons['icon'], 'iconlarge': updated_icons['icon_secondary']})

# Write the updated json back into the file
with open('commanderData.json', 'w', encoding='utf-8') as f:
    json.dump(commander_data, f, indent=4, ensure_ascii=False)
