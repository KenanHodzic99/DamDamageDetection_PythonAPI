import {CategorizedImg} from "./types"
import {backendUrl, deleteById, getData, jsonHeaders} from "./backend"

export function getCategorizedImg() {
    return getData("categorized-img/list")
}

export function getCategorizedImgById(id: number) {
    return getData("categorized-img/" + id)
}


export function deleteCategorizedImgById(id: number) {
    return deleteById("categorized-img/delete/", id)
}

export function addCategorizedImg(categorizedImg: CategorizedImg) {
    return fetch(backendUrl + "/categorized-img/create", {
        method: "POST",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(categorizedImg),
    })
}

export function updateCategorizedImg(categorizedImg: CategorizedImg) {
    return fetch(backendUrl + "/categorized-img/update/" + categorizedImg.id, {
        method: "PUT",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(categorizedImg),
    })
}

export default {
    getCategorizedImg,
    getCategorizedImgById,
    deleteCategorizedImgById,
    addCategorizedImg,
    updateCategorizedImg
}