import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import {Button} from "@mui/material"
import WaterDamageOutlinedIcon from '@mui/icons-material/WaterDamageOutlined';
import {NavLink} from "react-router-dom"

const darkTheme = createTheme({
    palette: {
        primary: {
            main: "#212A3E"
        }
    }
})

const TopBar = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar variant="regular">
                    <Box sx={{flexGrow: 1}}></Box>
                    <Button size={"large"} component={NavLink} color="inherit" style={{textTransform: "initial"}} to={"/"}>
                        <WaterDamageOutlinedIcon style={{marginRight: "10px"}}/> Dam Damage Detection
                    </Button>
                    <Box sx={{flexGrow: 1}}></Box>
                    <Button color="inherit" href="/logout">Logout</Button>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    )
}
export default TopBar