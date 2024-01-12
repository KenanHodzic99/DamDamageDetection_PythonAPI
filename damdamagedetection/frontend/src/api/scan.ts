import {Scan} from "./types"
import {backendUrl, deleteById, getData, jsonHeaders} from "./backend"

export function getScans() {
    return getData("scan/list")
}

export function getScansByModelId(id: number){
    return fetch(backendUrl + "/scan/list/" + id, {
        method: "GET",
        mode: "cors",
        headers: jsonHeaders
    })
}

export function getScanById(id: number) {
    return getData("scan/" + id)
}


export function deleteScanById(id: number) {
    return deleteById("scan/delete/", id)
}

export function addScan(scan: Scan) {
    return fetch(backendUrl + "/scan/create", {
        method: "POST",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(scan),
    })
}

export function updateScan(scan: Scan) {
    return fetch(backendUrl + "/scan/update/" + scan.id, {
        method: "PUT",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(scan),
    })
}

export default {
    getScans,
    getScanById,
    getScansByModelId,
    addScan,
    updateScan
}