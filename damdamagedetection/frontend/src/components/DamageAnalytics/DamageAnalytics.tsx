import React, {useEffect, useReducer, useState} from "react";
import {CategorizedImg} from "../../api/types";
import {useSnackbar} from "notistack";
import CategorizedImgAPI from "../../api/categorized-img";
import {Box, Button, Card, Checkbox, Grid, Typography} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";


const DamageAnalytics = () => {
    const [categorizedImges, setCategorizedImges] = useState<CategorizedImg[]>([])
    const [damagedSectors, setDamagedSectors] = useState<number[]>([])
    const [_, forceUpdate] = useReducer(x => x + 1, 0);
    const [loading, setLoading] = useState(false)
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        setLoading(true)
        CategorizedImgAPI.getCategorizedImg()
            .then((response) => response.json())
            .then((fetched) => {
                const processedFetched = (fetched as unknown as CategorizedImg[]).filter(img => img.threatLevel !== null && img.threatLevel?.id !== 1 && img.addressed == null)
                setCategorizedImges(processedFetched)
                setDamagedSectors(processedFetched.map(img => img.sector))
                setLoading(false)
            }).catch((reason) => {
            enqueueSnackbar("Couldn't get categorized images.", {variant: "error"})
            console.error("Categorized images couldn't be fetched because: " + reason)
        })
    }, [])

    const handleSave = (imageId: any) => {
        const image = categorizedImges.find((img) => img.id == imageId)
        if(image) {
            CategorizedImgAPI.updateCategorizedImg(image)
                .then(response => response.json())
                .then(updatedImage => {
                    setCategorizedImges(prevState => prevState.filter(img => img.id != imageId))
                    enqueueSnackbar("Successfully saved changes!", {variant: "success"})
                }).catch((reason) => {
                enqueueSnackbar("Couldn't save changes.", {variant: "error"})
                console.error("Couldn't save changes because: " + reason)
            })
        } else {
            enqueueSnackbar("Couldn't save changes.", {variant: "error"})
        }
    }

    const handleAddressedChange = (imageId: any, checked: boolean) => {
        setCategorizedImges((prevState) => {
            prevState.forEach(image => {
                if(image.id == imageId){
                    image.addressed = checked
                }
            })
            return prevState
        })
        forceUpdate()
    }

    const makeCards = ():any => {
        const cards: any = []
        categorizedImges.forEach(categorizedImg => {
            cards.push(
                <Grid key={categorizedImg.id} item xs={3}>
                    <Card>
                        <Box style={{height: "256px", width: "256px", margin: "5%", marginLeft: "12%", borderRadius: "4px", boxShadow: "12px 12px 2px 1px lightgray"}} component={"img"} alt={"Graph"} src={categorizedImg.img} />
                        <h3 style={{textAlign: "center"}}>{"Threat level:  "}</h3>
                        <h1 style={{color: "rgb(170, 74, 68)", textAlign:"center"}}>{categorizedImg.threatLevel?.name.toUpperCase()}</h1>
                        <h4 style={{textAlign: "center"}}>{"Sector: " + categorizedImg.sector}</h4>
                        <Box style={{display: "flex", justifyContent: "space-evenly"}}>
                        <h3>Was it addressed ?</h3>
                        <Checkbox key={categorizedImg.id}
                            checked={categorizedImg.addressed ? categorizedImg.addressed : false}
                            onChange={(event) => handleAddressedChange(categorizedImg.id, event.target.checked)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        </Box>
                        <Button sx={{width:"94%", margin:"10px"}} size={"large"} variant="contained" color={"success"} onClick={() => handleSave(categorizedImg.id)}>Save</Button>
                    </Card>
                </Grid>
            )})
        return cards
    }

    const makeMapRow = (startNumber: number, increment: number) => {
        const columns = []
        let counter = startNumber + increment
        if(damagedSectors.includes(startNumber)){
            columns.push(
                <Grid item xs={1}><Typography style={{backgroundColor:"red", textAlign: "center",color:"white", border:"2px solid rgb(33, 42, 62)", borderRadius:"4px", padding:"10px"}}>{startNumber}</Typography></Grid>
            )
        } else {
            columns.push(
                <Grid item xs={1}><Typography style={{backgroundColor:"white", textAlign: "center",color:"rgb(33, 42, 62)", border:"2px solid rgb(33, 42, 62)", borderRadius:"4px", padding:"10px"}}>{startNumber}</Typography></Grid>
            )
        }
        if(damagedSectors.includes(counter)){
            columns.push(
                <Grid item xs={1}><Typography style={{backgroundColor:"red", textAlign: "center",color:"white", border:"2px solid rgb(33, 42, 62)", borderRadius:"4px", padding:"10px"}}>{counter}</Typography></Grid>
            )
        } else {
            columns.push(
                <Grid item xs={1}><Typography style={{backgroundColor:"white", textAlign: "center",color:"rgb(33, 42, 62)", border:"2px solid rgb(33, 42, 62)", borderRadius:"4px", padding:"10px"}}>{counter}</Typography></Grid>
            )
        }


        for(let i=0; i<10; i++){
            counter += increment
            if(damagedSectors.includes(counter)){
                columns.push(
                    <Grid item xs={1}><Typography style={{backgroundColor:"red", textAlign: "center",color:"white", border:"2px solid rgb(33, 42, 62)", borderRadius:"4px", padding:"10px"}}>{counter}</Typography></Grid>
                )
            } else {
                columns.push(
                    <Grid item xs={1}><Typography style={{backgroundColor:"white", textAlign: "center",color:"rgb(33, 42, 62)", border:"2px solid rgb(33, 42, 62)", borderRadius:"4px", padding:"10px"}}>{counter}</Typography></Grid>
                )
            }
        }
        return columns;
    }

    return (loading ? <CircularProgress /> :
            <>
            <Grid container spacing={3}>
                {makeCards()}
            </Grid>
                <Box>
                    <Box>
                        <h2>Sector map legend:</h2>
                        <ul>
                            <li>Red sectors are sectors that have damage reported on them</li>
                            <li>The sectors are the size of ten square meters</li>
                            <li>The displayed map takes into account a dam of 100m x 110m</li>
                            <li>Sectors are an approximation of location to help narrow down the search and should not be taken literally</li>
                            <li>Sector locations by number are as displayed on the map.</li>
                        </ul>
                    </Box>
                    <Grid style={{marginTop: "20px", marginBottom: "20px", paddingBottom:"10px", paddingRight:"10px", border:"2px solid rgb(33, 42, 62)", borderRadius: "4px"}} container spacing={1}>
                        {makeMapRow(1,1)}
                        {makeMapRow(24,-1)}
                        {makeMapRow(25,1)}
                        {makeMapRow(48,-1)}
                        {makeMapRow(49,1)}
                        {makeMapRow(72,-1)}
                        {makeMapRow(73,1)}
                        {makeMapRow(96,-1)}
                        {makeMapRow(97,1)}
                        {makeMapRow(120,-1)}
                    </Grid>
                    <Box style={{height: "50px", width: "full"}}>

                    </Box>
                </Box>
            </>
    )
}

export default DamageAnalytics