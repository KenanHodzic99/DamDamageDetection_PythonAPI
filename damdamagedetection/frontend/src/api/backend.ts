export const backendBaseUrl = "http://localhost:8081"
export const backendUrl = backendBaseUrl + "/api/v1"

export const xmlHttpRequestHeaders = (contentType: string) : HeadersInit => {
    return {
        "Content-Type": contentType,
        "X-Requested-With": "XMLHttpRequest"
    }
}

export const jsonHeaders = xmlHttpRequestHeaders("application/json")

export function exchangeJson(url: string, method = "GET", body?: BodyInit): Promise<Response> {
    return exchangeContent(url, method, jsonHeaders, body)
}

export function exchangeContent(url: string, method = "GET", headers: HeadersInit, body?: BodyInit): Promise<Response> {
    const requestParams = {
        method: method,
        mode: "cors",
        headers: headers
    } as RequestInit

    if(body) {
        requestParams.body = body
    }

    return exchange(url, method, requestParams)
}

function exchange(url: string, method: string, requestParams: RequestInit): Promise<Response> {
    return fetch(url, requestParams).then(response => {
        if(response.status == 401) {
            console.log("Error: Not logged in (any more).")
            window.location.reload()
        }
        if(!response.ok) {
            console.error("Error: ", response)
            throw response
        }
        return response
    }).catch(reason => {
        console.error("Error: ", reason)
        throw reason
    }).then()
}

export function getUserRole(): Promise<Response> {
    return exchangeJson(backendUrl + "/me/role")
}

export function getData(path: string): Promise<Response> {
    return exchangeJson(backendUrl + "/" + path)
}

export function getById(path: string, id: number): Promise<Response> {
    return exchangeJson(backendUrl + "/" + path + "/" + id)
}

export function deleteById(path: string, id: number) {
    return exchangeJson(backendUrl + "/" + path + "/" + id, "DELETE")
}

export function post(path: string, formData: any) {
    const requestParams = {
        method: "POST",
        mode: "cors",
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
        body: formData
    } as RequestInit
    return exchange(backendUrl + "/" + path, "POST", requestParams)
}
