export type User = {
    id?: number,
    username: string,
    password: string,
    roles: string,
    firstname?: string,
    lastname?: string,
}

export type ThreatLevel = {
    id: number,
    name: string
}

export type CategorizedImg = {
    id: number,
    filename: string,

    sector: number,
    threatLevel?: ThreatLevel,
    addressed?: boolean,
    img: string
}

export type Model = {
    id: number,
    filename: string,
    created: string,
    accuracy: string,
    graph: string
}

export type Scan = {
    id: number,
    date: string,
    model: Model,
    scanned: number,
    cracked: number,
    nonCracked: number
}