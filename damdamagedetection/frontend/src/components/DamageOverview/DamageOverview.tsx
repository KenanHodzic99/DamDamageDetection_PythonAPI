import React, {useEffect, useState} from "react";
import {CategorizedImg, ThreatLevel} from "../../api/types";
import CircularProgress from '@mui/material/CircularProgress';
import {useSnackbar} from "notistack";
import {AutocompleteOption} from "../MLAnalytics/MLAnalytics";
import CategorizedImgAPI from "../../api/categorized-img";
import ThreatLevelAPI from "../../api/threat-level"
import {Box, Button, Card, Grid} from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";


const DamageOverview = () => {
    const [categorizedImges, setCategorizedImges] = useState<CategorizedImg[]>([])
    const [threatLevels, setThreatLevels] = useState<ThreatLevel[]>([])
    const [comboOptions, setComboOptions] = useState<AutocompleteOption[]>([])
    const [loading, setLoading] = useState(false)
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        setLoading(true)
        CategorizedImgAPI.getCategorizedImg()
            .then((response) => response.json())
            .then((fetched) => {
                setCategorizedImges((fetched as unknown as CategorizedImg[]).filter(img => img.threatLevel === null))
                ThreatLevelAPI.getThreatLevel()
                    .then((response) => response.json())
                    .then((fetchedThreatLevel) => {
                        setLoading(false)
                        setThreatLevels(fetchedThreatLevel as unknown as ThreatLevel[])
                        setComboOptions((fetchedThreatLevel as unknown as ThreatLevel[]).map(threatLevel => {
                            return {id: threatLevel.id.toString(), label: threatLevel.name}
                        }))
                    }).catch((reason) => {
                    enqueueSnackbar("Couldn't get threat levels.", {variant: "error"})
                    console.error("Threat levels couldn't be fetched because: " + reason)
                })
            }).catch((reason) => {
            enqueueSnackbar("Couldn't get categorized images.", {variant: "error"})
            console.error("Categorized images couldn't be fetched because: " + reason)
        })
    }, [])

    const handleThreatLevelChange = (imageId: any, threatLevelId: any) => {
        setCategorizedImges((prevState) => {
            prevState.forEach(image => {
                if(image.id == imageId){
                    image.threatLevel = threatLevels.find( (level) => level.id == threatLevelId)
                }
            })
            return prevState
        })
    }

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

    const makeCards = ():any => {
        const cards: any = []
        categorizedImges.forEach(categorizedImg => {
            cards.push(
            <Grid key={categorizedImg.id} item xs={3}>
                <Card>
                    <Box style={{height: "256px", width: "256px", margin: "5%", marginLeft: "12%", borderRadius: "4px", boxShadow: "12px 12px 2px 1px lightgray"}} component={"img"} alt={"Graph"} src={categorizedImg.img} />
                <Autocomplete
                    disablePortal
                    disableClearable
                    id="combo-box-demo"
                    options={comboOptions}
                    onChange={(event, value) => handleThreatLevelChange(categorizedImg.id, value.id)}
                    sx={{width: "full", margin: "10px"}}
                    renderInput={(params) => <TextField {...params} label="Threat level..."/>}
                />
                <Button sx={{width:"94%", margin:"10px"}} size={"large"} variant="contained" color={"success"} onClick={() => handleSave(categorizedImg.id)}>Save</Button>
                </Card>
            </Grid>
            )})
        return cards
    }

    return (loading ? <CircularProgress /> :
        <Grid container spacing={3}>
            {makeCards()}
        </Grid>
    )
}

export default DamageOverview