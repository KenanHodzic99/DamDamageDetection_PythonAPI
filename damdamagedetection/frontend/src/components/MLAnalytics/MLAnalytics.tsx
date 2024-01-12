import React, {useEffect, useState} from "react";
import {Model, Scan} from "../../api/types";
import ModelAPI from "../../api/model"
import ScanAPI from "../../api/scan"
import {useSnackbar} from "notistack";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Box, Grid} from "@mui/material";
import {format, parseISO} from "date-fns";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

export type AutocompleteOption = {
    id: string,
    label: string
}

const MLAnalytics = () => {
    const [models, setModels] = useState<Model[]>([])
    const [scans, setScans] = useState<Scan[]>([])
    const [comboOptions, setComboOptions] = useState<AutocompleteOption[]>([])
    const [selectedModel, setSelectedModel] = useState<Model>()
    const [loading, setLoading] = useState(false)
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        setLoading(true)
        ModelAPI.getModels()
            .then((response) => response.json())
            .then((fetchedModels) => {
                setLoading(false)
                setModels(fetchedModels as unknown as Model[])
                setComboOptions((fetchedModels as unknown as Model[]).map(model => {
                    return {id: model.id.toString(), label: model.filename}
                }))
            }).catch((reason) => {
            enqueueSnackbar("Couldn't get Models.", {variant: "error"})
            console.error("Models couldn't be fetched because: " + reason)
        })
    }, [])

    const handleModelChange = (event: any, values: any) => {
        ScanAPI.getScansByModelId(Number(values.id)).then(response => response.json())
            .then((fetchedScans) => {
                setSelectedModel(models.find(model => model.id === Number(values.id)))
                setScans(fetchedScans as unknown as Scan[])
            }).catch((reason) => {
            enqueueSnackbar("Couldn't get Scans.", {variant: "error"})
            console.error("Scans couldn't be fetched because: " + reason)
        })
    }

    const getScanColumns = (): GridColDef[] => {
        return [
            {headerName: "Date of scan", field: "date", editable: false, flex: 1, valueGetter: params => format(new Date(params.value), "hh:MM:ss dd.MM.yyyy")},
            {headerName: "Total scanned", field: "scanned", editable: false, flex: 1},
            {headerName: "Detected as cracked", field: "cracked", editable: false, flex: 1},
            {headerName: "Detected as non cracked", field: "nonCracked", editable: false, flex: 1},
        ]
    }

    return (<>
        <Autocomplete
            disablePortal
            disableClearable
            id="combo-box-demo"
            options={comboOptions}
            onChange={handleModelChange}
            sx={{width: 300}}
            renderInput={(params) => <TextField {...params} label="Detection model..."/>}
        />
        {selectedModel !== undefined ?
            <>
            <Grid style={{paddingTop: "5%", paddingBottom: "2%"}} container spacing={2}>
                <Grid item xs={6}>
                    <h2>{"Accuracy: " + Number((Number(selectedModel.accuracy) * 100).toFixed(4)) + "%"}</h2>
                    <h2>{"Date created: " + format(parseISO(selectedModel?.created), "dd.MM.yyyy")}</h2>
                    <h3>Confusion matrix legend:</h3>
                    <ul>
                        <li>True label - This shows the true amount of pictures per class.</li>
                        <li>Predicted label - This shows the amount of pictures per class as guessed by the model.</li>
                        <li>The left diagonal shows the amount of correct guesses.</li>
                        <li>The darker the color the bigger the group.</li>
                    </ul>
                </Grid>
                <Grid style={{textAlign: "left"}} item xs={6} >
                    <Box style={{border: "2px solid black", borderRadius: "3%"}} component={"img"} alt={"Graph"} src={selectedModel.graph}></Box>
                </Grid>
            </Grid>
            <h2>Scans performed using model: </h2>
            <DataGrid
                columns={getScanColumns()}
                autoHeight={true}
                rows={scans}
                loading={loading}
            />
            </>
            :
            <p>Please select a model!</p>
        }
    </>)
}

export default MLAnalytics