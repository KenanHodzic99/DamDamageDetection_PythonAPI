import App from "./App"
import {act} from "react-dom/test-utils"
import {render} from "@testing-library/react"
import {SnackbarProvider} from "notistack"

test("react app renders", () => {
  const container = document.createElement("div")
  document.body.appendChild(container)

  act(() => {
    render(<SnackbarProvider><App/></SnackbarProvider>)
  })

  expect(document.getElementsByClassName("full-app-page")).not.toBeUndefined()
})
