import {jsonHeaders} from "./backend";

const pythonBackendUrl = "http://localhost:5000"

export function getScanTime() {
    return fetch(pythonBackendUrl + "/scan/time", {
        method: "GET",
        mode: "cors",
        headers: jsonHeaders,
    })
}

export function getScanAmount() {
    return fetch(pythonBackendUrl + "/scan/amount", {
        method: "GET",
        mode: "cors",
        headers: jsonHeaders,
    })
}

export function cancelScan() {
    return fetch(pythonBackendUrl + "/scan/cancel", {
        method: "GET",
        mode: "cors",
        headers: jsonHeaders,
    })
}

export function changeScanTime(newScanTime: string) {
    return fetch(pythonBackendUrl + "/scan/time/" + newScanTime, {
        method: "GET",
        mode: "cors",
        headers: jsonHeaders,
    })
}

export function runScan(modelFilename: string) {
    return fetch(pythonBackendUrl + "/scan/" + modelFilename, {
        method: "GET",
        mode: "cors",
        headers: jsonHeaders,
    })
}

export function runScanNow() {
    return fetch(pythonBackendUrl + "/scan/now", {
        method: "GET",
        mode: "cors",
        headers: jsonHeaders,
    })
}

export function retrainModel(filename: string) {
    return fetch(pythonBackendUrl + "/model/retrain/" + filename, {
        method: "GET",
        mode: "cors",
        headers: jsonHeaders,
    })
}

export default {
    getScanTime,
    changeScanTime,
    runScanNow,
    getScanAmount,
    runScan,
    cancelScan,
    retrainModel
}