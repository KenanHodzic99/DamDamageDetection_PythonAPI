import {ThreatLevel} from "./types"
import {backendUrl, deleteById, getData, jsonHeaders} from "./backend"

export function getThreatLevel() {
    return getData("threat-level/list")
}

export function getThreatLevelById(id: number) {
    return getData("threat-level/" + id)
}


export function deleteThreatLevelById(id: number) {
    return deleteById("threat-level/delete/", id)
}

export function addThreatLevel(threatLevel: ThreatLevel) {
    return fetch(backendUrl + "/threat-level/create", {
        method: "POST",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(threatLevel),
    })
}

export function updateThreatLevel(threatLevel: ThreatLevel) {
    return fetch(backendUrl + "/threat-level/update/" + threatLevel.id, {
        method: "PUT",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(threatLevel),
    })
}

export default {
    getThreatLevel,
    getThreatLevelById,
    deleteThreatLevelById,
    addThreatLevel,
    updateThreatLevel
}