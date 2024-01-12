import React from "react"

const userContext = React.createContext<{roles: string[]}>({roles: []})

function rolesInclude(roles: any, role: string, trueIfApplicationAdmin = true): any {
    return roles && roles.includes && (roles.includes(role) || (trueIfApplicationAdmin && isApplicationAdmin(roles)))
}
const isApplicationAdmin  = (roles: any) => rolesInclude(roles, "ROLE_ADMIN", false)

export {userContext, isApplicationAdmin}


