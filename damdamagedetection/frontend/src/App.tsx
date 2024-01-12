import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './App.css';
import {useSnackbar} from "notistack"
import {getUserRole} from "./api/backend";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {userContext} from "./authentication/UserContext";
import {Box, CssBaseline, Drawer, ThemeProvider, Toolbar} from "@mui/material";
import {theme} from "./components/Theme/Theme";
import Topbar from "./components/TopBar/TopBar";
import SideNavBar from "./components/SideNavBar/SideNavBar";
import UserManagement from "./components/UserManagement/UserManagement";
import DamageAnalytics from "./components/DamageAnalytics/DamageAnalytics";
import MLAnalytics from "./components/MLAnalytics/MLAnalytics";
import DamageOverview from "./components/DamageOverview/DamageOverview";
import ControlPanel from "./components/ControlPanel/ControlPanel";

function App() {
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [initiated, setInitiated] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  if (!initiated) {
    setInitiated(true)
    getUserRole().then((response) => {
      return response.json()
    }).then((json) => {
      setUserRoles(json)
      setInitiated(true)
    }).catch((reason) => {
      enqueueSnackbar("Unable to get roles for users.", {
        variant: "error",
      })
      console.log(
          "Unable to get roles for users: " + reason
      )
    })
  }

  const drawerWidth = 260

  return (
      <userContext.Provider value={{ roles: userRoles }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Box sx={{display: "flex", flexGrow: 1, height: "100%"}}>
                <CssBaseline/>
                <Topbar/>
                <Drawer
                    variant="permanent"
                    sx={{
                      width: drawerWidth,
                      flexShrink: 0,
                      ["& .MuiDrawer-paper"]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                      },
                    }}
                    className={"no-print"}
                >
                  <Toolbar/>
                  <SideNavBar/>
                </Drawer>
                <Box
                    component="main"
                    sx={{flexGrow: 1, p: 3, height: "100%", paddingTop: "6em"}}
                >
                  <Routes>
                    <Route path="/users" element={<UserManagement/>}/>
                    <Route path="/analytics" element={<MLAnalytics/>}/>
                    <Route path="/damage-analytics" element={<DamageAnalytics/>}/>
                    <Route path="/damage-overview" element={<DamageOverview/>}/>
                    <Route path="/control-panel" element={<ControlPanel/>}/>
                  </Routes>
                </Box>
              </Box>
            </BrowserRouter>
          </ThemeProvider>
        </LocalizationProvider>
      </userContext.Provider>
  );
}

export default App;
