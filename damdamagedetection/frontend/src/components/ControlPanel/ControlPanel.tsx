import {Box, Button, CircularProgress, Grid, Typography} from "@mui/material";
import React, {useEffect, useReducer, useState} from "react";
import {Model, Scan} from "../../api/types";
import {AutocompleteOption} from "../MLAnalytics/MLAnalytics";
import {useSnackbar} from "notistack";
import ModelAPI from "../../api/model";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import PythonAPI from "../../api/python-api";
import {TimePicker} from "@mui/x-date-pickers";
import {format} from "date-fns";


const ControlPanel = () => {
    const [models, setModels] = useState<Model[]>([])
    const [selectedProcessingModel, setSelectedProcessingModel] = useState<Model>()
    const [selectedTrainingModel, setSelectedTrainingModel] = useState<Model>()
    const [scanTime, setScanTime] = useState<string>("")
    const [selectedScanTime, setSelectedScanTime] = useState()
    const [scanAmount, setScanAmount] = useState(0)
    const [comboOptions, setComboOptions] = useState<AutocompleteOption[]>([])
    const {enqueueSnackbar} = useSnackbar()

    const [isProcessingInProgress, setIsProcessingInProgress] = useState<boolean>(false)
    const [isReTrainingInProgress, setIsReTrainingInProgress] = useState<boolean>(false)
    const [isScanningInProgress, setIsScanningInProgress] = useState<boolean>(false)

    useEffect(() => {
        ModelAPI.getModels()
            .then((response) => response.json())
            .then((fetchedModels) => {
                setModels(fetchedModels as unknown as Model[])
                setComboOptions((fetchedModels as unknown as Model[]).map(model => {
                    return {id: model.id.toString(), label: model.filename}
                }))
                PythonAPI.getScanAmount()
                    .then((response) => response.json())
                    .then(scanAmount => setScanAmount(scanAmount))
                PythonAPI.getScanTime()
                    .then((response) => response.text())
                    .then(text => setScanTime(text.startsWith('C') ? text : text + "h"))
            }).catch((reason) => {
            enqueueSnackbar("Couldn't get Models.", {variant: "error"})
            console.error("Models couldn't be fetched because: " + reason)
        })
    }, [])

    const handleTrainingModelChange = (event: any, values: any) => {
        setSelectedTrainingModel(models.find(model => model.id === Number(values.id)))
    }

    const handleProcessingModelChange = (event: any, values: any) => {
        setSelectedProcessingModel(models.find(model => model.id === Number(values.id)))
    }

    const handleProcessingClick = () => {
        if(selectedProcessingModel){
            setIsProcessingInProgress(true)
        PythonAPI.runScan(selectedProcessingModel.filename)
            .then(response => {
                if(response.status === 200){
                    setIsProcessingInProgress(false)
                    return response.text()
                } else {
                    setIsProcessingInProgress(false)
                    enqueueSnackbar("Couldn't run processing.", {variant: "error"})
                    return response.text()
                }
            }).then(text => {
                console.debug(text)
                enqueueSnackbar("Successfully ran processing.", {variant: "success"})
        })}
        else {
            enqueueSnackbar("Please select a model first.", {variant: "error"})
        }
    }

    const handleReTrainingClick = () => {
        if(selectedTrainingModel){
            setIsReTrainingInProgress(true)
            PythonAPI.retrainModel(selectedTrainingModel.filename)
                .then(response => {
                    if(response.status === 200){
                        setIsReTrainingInProgress(false)
                        return response.text()
                    } else {
                        setIsReTrainingInProgress(false)
                        enqueueSnackbar("Couldn't retrain model.", {variant: "error"})
                        return response.text()
                    }
                }).then(text => {
                console.debug(text)
                enqueueSnackbar("Successfully retrained model.", {variant: "success"})
            })}
        else {
            enqueueSnackbar("Please select a model first.", {variant: "error"})
        }
    }

    const handleFlightTimeChange = (newValue: any) => {
        setSelectedScanTime(newValue)
    }

    const handleFlightTimeClick = () => {
        if(selectedScanTime) {
            PythonAPI.changeScanTime(format(selectedScanTime, "HH:mm")).then(response => {
                if(response.status === 200){
                    setScanTime(format(selectedScanTime, "HH:mm") + "h")
                    enqueueSnackbar("Successfully changed scan time.", {variant: "success"})
                } else {
                    enqueueSnackbar("Couldn't change scan time.", {variant: "error"})
                }
            })
        } else {
            enqueueSnackbar("Please select a scan time.", {variant: "error"})
        }
    }

    const handleCancelFlightClick = () => {
        PythonAPI.cancelScan().then(response => {
            if(response.status === 200){
                setScanTime("Canceled")
                enqueueSnackbar("Successfully canceled all scans.", {variant: "success"})
            } else {
                enqueueSnackbar("Couldn't cancel scans.", {variant: "error"})
            }
        })
    }

    const handleStartFlightClick = () => {
        setIsScanningInProgress(true)
        PythonAPI.runScanNow().then(response => {
            if(response.status === 200){
                setIsScanningInProgress(false)
                enqueueSnackbar("Successfully finished scan.", {variant: "success"})
            } else {
                setIsScanningInProgress(false)
                enqueueSnackbar("Couldn't start scan.", {variant: "error"})
            }
        })
    }

    return (<>
        <Grid container spacing={4}>
            <Grid item xs={6}>
                <Box>
                    <Typography style={{marginBottom: "15px"}} variant={"h5"}>{"Number of scans ready to be processed: " + scanAmount}</Typography>
                    <ul>
                    <li>By processing the scan new items will be added to damage overview for further analysis.</li>
                    <li>Once started processing can not be stopped.</li>
                    <li>Please select the model version you wish to use for processing.</li>
                    <li style={{marginBottom: "15px"}}>While processing is occurring please do not close or refresh the
                        window.</li>
                    </ul>
                    <Box style={{display: "flex", width: "full"}}>
                    <Autocomplete
                        disablePortal
                        disableClearable
                        id="combo-box-demo"
                        options={comboOptions}
                        onChange={handleProcessingModelChange}
                        sx={{width: 450}}
                        renderInput={(params) => <TextField {...params} label="Detection model..."/>}
                    />
                    <Button style={{backgroundColor: "#212A3E", float: "right", width:"165px"}} variant={"contained"} onClick={handleProcessingClick}>Begin processing</Button>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={6}>
                {isProcessingInProgress ?
                    <Box sx={{textAlign: "center"}}>
                        <Typography sx={{marginBottom: "10px"}} variant={"h5"}>Scan processing is currently in progress</Typography>
                        <CircularProgress sx={{marginBottom: "10px", color: "#212A3E"}} size={"8rem"} />
                        <Typography sx={{color: "red"}} variant={"h6"}>Please do not close or refresh the window.</Typography>
                    </Box>
                    : <></>}
            </Grid>
            <Grid item xs={6}>
                <Box>
                    <Typography variant={"h5"}>Retrain a new model based on an existing version</Typography>
                    <ul>
                        <li>This will create a new version of the model based on the selected model.</li>
                        <li>All of the data used is the data collected and sorted through the application.</li>
                        <li>Once started this may take a long time to complete.</li>
                        <li>Please select the model version you wish to use as a base for retraining.</li>
                        <li style={{marginBottom: "15px"}}>While training is occurring please do not close or refresh the
                            window.</li>
                    </ul>
                <Box style={{display: "flex"}}>
                    <Autocomplete
                        disablePortal
                        disableClearable
                        id="combo-box-demo"
                        options={comboOptions}
                        onChange={handleTrainingModelChange}
                        sx={{width: 450}}
                        renderInput={(params) => <TextField {...params} label="Detection model..."/>}
                    />
                    <Button style={{backgroundColor: "#212A3E", float: "right", width:"165px"}} variant={"contained"} onClick={handleReTrainingClick}>Start retraining</Button>
                </Box>
                </Box>
            </Grid>
            <Grid item xs={6}>
                {isReTrainingInProgress ?
                    <Box sx={{textAlign: "center"}}>
                        <Typography sx={{marginBottom: "10px"}} variant={"h5"}>Model re-training is currently in progress</Typography>
                        <CircularProgress sx={{marginBottom: "10px", color: "#212A3E"}} size={"8rem"} />
                        <Typography sx={{color: "red"}} variant={"h6"}>Please do not close or refresh the window.</Typography>
                    </Box>
                    : <></>}
            </Grid>
            <Grid item xs={6}>
                <Box>
                    <Typography variant={"h5"}>{"Current daily scan time: " + scanTime}</Typography>
                    <ul>
                        <li>This refers the daily occurrence of the drone flight time.</li>
                        <li>Once set the drone will fly and scan the dam at the designated time every day.</li>
                        <li>The flight can also be cancelled or started straight away.</li>
                        <li style={{marginBottom: "15px"}}>Once the flights are canceled it will not occur until a time is set again.</li>
                    </ul>
                    <Box style={{display: "flex", marginBottom: "10px"}}>
                        <TimePicker sx={{width: "450px"}} label="Daily flight time" onChange={handleFlightTimeChange} ampm={false} value={selectedScanTime}/>
                        <Button style={{backgroundColor: "#212A3E", width:"165px"}} variant={"contained"} onClick={handleFlightTimeClick}>Change daily scan time</Button>
                    </Box>
                    <Box style={{display: "flex"}}>
                        <Button style={{backgroundColor: "#212A3E", height:"50px" , width: "40%", marginRight: "53px"}} variant={"contained"} onClick={handleCancelFlightClick}>Cancel flights</Button>
                        <Button style={{backgroundColor: "#212A3E", width: "40%"}} variant={"contained"} onClick={handleStartFlightClick}>Start flight</Button>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={6}>
                {isScanningInProgress ?
                    <Box sx={{textAlign: "center"}}>
                        <Typography sx={{marginBottom: "10px"}} variant={"h5"}>Scan is currently in progress</Typography>
                        <CircularProgress sx={{marginBottom: "10px", color: "#212A3E"}} size={"8rem"} />
                        <Typography sx={{color: "red"}} variant={"h6"}>Please do not close or refresh the window.</Typography>
                    </Box>
                    : <></>}
            </Grid>
        </Grid>
    </>)
}

export default ControlPanel