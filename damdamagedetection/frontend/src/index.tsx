import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import {SnackbarProvider} from "notistack"

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
)
root.render(
    <React.StrictMode>
        <SnackbarProvider preventDuplicate={true} autoHideDuration={7000}>
            <App/>
        </SnackbarProvider>
    </React.StrictMode>
)
