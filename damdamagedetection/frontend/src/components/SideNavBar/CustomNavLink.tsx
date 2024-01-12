import React from "react"
import {NavLink, NavLinkProps} from "react-router-dom"

const CustomNavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => (
    <NavLink
        ref={ref}
        {...props}
        className={({ isActive }) => props.className + (isActive ? " Mui-selected" : "")}
    />
))
CustomNavLink.displayName = "MuiNavLink"

export default CustomNavLink