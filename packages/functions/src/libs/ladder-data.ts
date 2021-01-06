

const extractTheProfileIDs = (data: Record<string, any>) => {
    const profileIDs = new Set();

    const {statGroups} = data;

    for (const group of statGroups) {
        for (const member of group["members"]) {

            const name = member["name"];
            profileIDs.add(name);
        }
    }

    return profileIDs;
}

export {
    extractTheProfileIDs
}