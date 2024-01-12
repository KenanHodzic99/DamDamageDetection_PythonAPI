import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import TableRowsIcon from "@mui/icons-material/TableRows"
import "./SideNavBar.css"
import CustomNavLink from "./CustomNavLink"
import {
    isApplicationAdmin,
    userContext
} from "../../authentication/UserContext"
import {
    PieChart,
    Warning,
    Assessment,
    PersonAdd,
} from "@mui/icons-material"
import KeyboardAltIcon from '@mui/icons-material/KeyboardAlt';

import {ReactElement, ReactNode} from "react"
import {IconProps, ListItemText} from "@mui/material"

export function ListMuiNavLinkItem(props: { to: string, icon?: ReactElement<IconProps>, children: ReactNode, target?: string }) {
    const icon = props.icon ? props.icon : <TableRowsIcon/>

    return (
        <ListItemButton component={CustomNavLink} to={props.to} target={props.target || ""}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <MenuLinkText>{props.children}</MenuLinkText>
        </ListItemButton>
    )
}

export function MenuLinkText(props: { children: ReactNode }) {
    return (<ListItemText>{props.children}</ListItemText>)
}

const SideNavBar = () => {
    return (
        <Box className="side-navbar" color={"#006c5f"}>
            <List sx={{padding: "0!important"}} component="nav">
                <userContext.Consumer>
                    {({roles}) =>
                        isApplicationAdmin(roles) && <>
                        <ListMuiNavLinkItem key={"control-panel"} to={"/control-panel"} icon={<KeyboardAltIcon />}>Control Panel</ListMuiNavLinkItem>
                        <ListMuiNavLinkItem key={"users"} to={"/users"} icon={<PersonAdd/>}>User Management</ListMuiNavLinkItem>
                        <ListMuiNavLinkItem key={"analytics"} to={"/analytics"} icon={<Assessment />}>ML Analytics</ListMuiNavLinkItem>
                        <ListMuiNavLinkItem key={"damage-analytics"} to={"/damage-analytics"} icon={<PieChart />}>Damage Analytics</ListMuiNavLinkItem>
                        </>}
                </userContext.Consumer>
                <ListMuiNavLinkItem key={"damage-overview"} to={"/damage-overview"} icon={<Warning />}>Damage Overview</ListMuiNavLinkItem>
            </List>
        </Box>
    )
}

export default SideNavBar
