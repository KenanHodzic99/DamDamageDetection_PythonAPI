import {User} from "./types"
import {backendUrl, deleteById, getData, jsonHeaders} from "./backend"

export function getUsers() {
    return getData("users")
}


export function deleteUserById(id: number) {
    return deleteById("users", id)
}

export function addUser(user: User) {
    return fetch(backendUrl + "/users", {
        method: "POST",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(user),
    })
}

export function updateUser(user: User) {
    return fetch(backendUrl + "/users/" + user.id, {
        method: "PUT",
        mode: "cors",
        headers: jsonHeaders,
        body: JSON.stringify(user),
    })
}

export default {
    getUsers,
    deleteUserById,
    addUser,
    updateUser
}