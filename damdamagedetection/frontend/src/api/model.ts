import {Model} from "./types"
import {backendUrl, deleteById, getData, jsonHeaders} from "./backend"

export function getModels() {
    return getData("model/list")
}

export function getModelById(id: number) {
    return getData("model/" + id)
}


export function deleteModelById(id: number) {
    return deleteById("model/delete/", id)
}

export function addModel(model: Model) {
    return fetch(backendUrl + "/model/create", {
        method: "POST",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(model),
    })
}

export function updateModel(model: Model) {
    return fetch(backendUrl + "/model/update/" + model.id, {
        method: "PUT",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(model),
    })
}

export default {
    getModels,
    deleteModelById,
    addModel,
    updateModel
}