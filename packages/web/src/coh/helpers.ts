const commanderIDsToNames: Record<number, string> = {
    186413: "usf_airborne_company",
    186415: "usf_armor_company",
    451587: "usf_armor_company_devm_edition",
    450483: "usf_dlc_commander3",
    450482: "usf_forward_assault_company",
    186414: "usf_infantry_company",
    260696: "usf_mechanized_company",
    254449: "usf_recon_support_company",
    261335: "usf_rifle_company",
    450479: "usf_tactical_support_company",
    452456: "usf_urban_assault_company",
    18369: "pm_airborne",
    450553: "british_advanced_emplacement_company",
    450074: "british_artillery_company",
    450073: "british_commando_company",
    450075: "british_engineer_company",
    452455: "british_lend_lease_assault_company",
    450554: "british_mobile_assault_company",
    450268: "british_support_company",
    450243: "british_vanguard_company",
    450286: "british_weapons_company",
    6116: "1941_tow_german_blitzkrieg",
    6118: "1941_tow_german_infantry",
    6117: "1941_tow_german_mechanized",
    7554: "aerial_superiority_doctrine",
    5568: "assault_support_doctrine",
    5570: "festung_armor_doctrine",
    5571: "festung_support_doctrine",
    5927: "fortified_armor_doctrine",
    7538: "german_air_supply",
    7541: "german_community_defense",
    7537: "german_elite_troops",
    7540: "german_encirclement",
    6905: "german_infantry_assault",
    258891: "german_mobile_defense",
    7249: "german_ostruppen_tree",
    7539: "german_urban_assault",
    5572: "jaeger_armor_doctrine",
    5573: "jaeger_infantry_doctrine",
    5930: "joint_operations_doctrine",
    5921: "lightning_war_doctrine",
    5928: "spearhead_doctrine",
    5929: "storm_tactics_doctrine",
    452454: "strategic_reserves_doctrine",
    6120: "1941_tow_soviet_combined_arms_army",
    6121: "1941_tow_soviet_reserve_army",
    6119: "1941_tow_soviet_shock_army",
    186229: "advanced_warfare_tactics",
    452461: "airbourne_troops_tactics",
    5926: "anti_infantry_tactics",
    5922: "conscripts_support_tactics",
    5575: "guard_motor_coordination_tactics",
    451588: "guard_motor_coordination_tactics_vonivan_edition",
    5576: "guard_rifle_anti_tank_tactics",
    5924: "mechanized_support",
    5578: "nkvd_rifle_disruption_tactics",
    5579: "shock_motor_heavy_tactics",
    5580: "shock_rifle_frontline_tactics",
    7546: "soviet_community_defense",
    7246: "soviet_counterattack",
    7543: "soviet_industry_commander",
    258974: "soviet_lend_lease",
    7544: "soviet_no_retreat",
    7542: "soviet_partisan",
    7545: "soviet_tank_hunters",
    7247: "soviet_urban",
    5923: "soviet_war_machine",
    5925: "terror_tactics",
    450495: "okw_battlefield_reconnaissance_doctrine",
    186419: "okw_breakthrough_doctrine",
    450496: "okw_dlc_commander_3",
    257800: "okw_elite_armored_doctrine",
    450494: "okw_firestorm_doctrine",
    259929: "okw_fortifications_doctrine",
    452452: "okw_grand_offensive_doctrine",
    186418: "okw_luftwaffe_ground_forces_doctrine",
    259657: "okw_scavenge_doctrine",
    451591: "okw_scavenge_doctrine_jesulin_edition",
    186417: "okw_special_operations_doctrine",
    347076: "pm_battles_hard",
};

const convertCommanderIDToName = (commanderID: number): string =>{
    if (Object.prototype.hasOwnProperty.call(commanderIDsToNames, commanderID)){
        return commanderIDsToNames[commanderID];
    } else {
        // In case we don't know the commander number
        return `${commanderID}`
    }
}


const sortArrayOfObjectsByTheirPropertyValue = (
    mapsData: Array<Record<string, string>>,
): Array<Record<string, string>> => {
    return mapsData.sort((a, b) => {
        if (a.value < b.value) {
            return -1;
        }
        if (a.value > b.value) {
            return 1;
        }
        return 0;
    });
};

export { convertCommanderIDToName, sortArrayOfObjectsByTheirPropertyValue};
