import React, {useContext, useEffect, useState} from "react"
import {User} from "../../api/types"
import {
    GridRenderEditCellParams,
    GridColDef,
    DataGrid,
    useGridApiContext,
    GridRowModesModel,
    GridRowModes, GridEventListener, MuiEvent, GridRowParams
} from "@mui/x-data-grid"
// @ts-ignore
import UserAPI from "../../api/users"
import {Autocomplete, Box, Button, IconButton, TextField} from "@mui/material"
import {isApplicationAdmin, userContext} from "../../authentication/UserContext"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {useSnackbar} from "notistack";

function newEntry(): User {
    return {
        id: 0,
        password: "",
        roles: "",
        username: "",
        firstname: "",
        lastname: ""
    }
}

interface MultiSelectOptionType {
    label: string
    id: string
    extendedLabel?: string
}

const getRolesValueOptions = (roles: any) => {
    const rolesValueOptions = [{
        extendedLabel: "User",
        label: "USER",
        id: "USER"
    }] as MultiSelectOptionType[]
    if (isApplicationAdmin(roles)) {
        rolesValueOptions.push({
            extendedLabel: "Application Admin",
            label: "APP_ADMIN",
            id: "APP_ADMIN"
        })
    }
    return rolesValueOptions
}

const MultiSelectEditField = (props: {
    params: GridRenderEditCellParams,
    valueOptions: MultiSelectOptionType[],
    initialValue: () => string[],
    readonly: boolean
}) => {
    const apiRef = useGridApiContext()

    const getOptionTypesFromIds = (ids: string[]) => {
        return props.valueOptions.filter((option) => ids.includes(option.id))
    }

    return (
        <Autocomplete
            openOnFocus={false}
            readOnly={props.readonly}
            multiple
            disableClearable={true}
            fullWidth
            size="small"
            options={props.valueOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => {
                return option.id == value.id
            }}
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                    {option.extendedLabel ? option.extendedLabel : option.label}
                </Box>
            )}
            value={getOptionTypesFromIds(props.initialValue()) || null}
            renderInput={(params) => <TextField {...params} variant={"outlined"} sx={{
                "& fieldset": {border: "none"},
            }}/>}
            onChange={(e, nv) => {
                apiRef.current.setEditCellValue({
                    id: props.params.id,
                    field: props.params.field,
                    value: nv.map(nv => nv.id).join(",")
                })
            }}
        />
    )
}

const UserManagement = () => {
    const user = useContext(userContext)
    const [users, setUsers] = useState<User[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
    const [loading, setLoading] = useState(false)
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        setLoading(true)
        UserAPI.getUsers()
            .then(response => response.json())
            .then(json => {
                setUsers(json)
                setLoading(false)
            })
    }, [])

    function handleDelete(id: any){
        UserAPI.deleteUserById(id).then(
            succeeded => {
                if (succeeded) {
                    enqueueSnackbar("Delete successful.", {variant: "success"})
                    setUsers(users.filter(row => row.id !== id))
                }}
        ).catch(reason => {
            console.error("Failed to delete row due to " + reason)
            enqueueSnackbar("Failed to delete.", {variant: "error"})
        })
    }

    function renderDeleteButton(params: any) {
        return (
            <IconButton aria-label="delete" onClick={() => handleDelete(params.row.id)}>
                <DeleteIcon />
            </IconButton>
        )
    }

    const handleAdd = () => {
        if (newEntry) {
            const entry = newEntry()
            setUsers((oldRows) => {
                if (oldRows.length === 0 || oldRows[0].id !== 0) {
                    return [{...entry}, ...oldRows]
                } else {
                    return oldRows
                }
            })
        }
    }

    function getColumns(user: { roles: string[] }): GridColDef[] {
        const rolesValueOptions = getRolesValueOptions(user.roles)
        return [
            {headerName: "Firstname", field: "firstname", editable: true, flex: 1},
            {headerName: "Lastname", field: "lastname", editable: true, flex: 1},
            {headerName: "Username", field: "username", editable: true, flex: 1},
            {headerName: "Password", field: "password", editable: true, flex: 1},
            {
                headerName: "Roles", field: "roles", editable: true, flex: 2,
                type: "string",
                renderEditCell: (params: GridRenderEditCellParams) => {
                    return (
                        <MultiSelectEditField readonly={false} params={params} valueOptions={rolesValueOptions} initialValue={() => params.value.split(",")}/>)
                },
                renderCell: (params: GridRenderEditCellParams) => (
                    <MultiSelectEditField readonly={true} params={params} valueOptions={rolesValueOptions} initialValue={() => params.value.split(",")}/>),
            },
            {
                field: "action",
                headerName: "",
                sortable: false,
                renderCell: renderDeleteButton
            }
        ]
    }

    function refreshPage() {
        window.location.reload();
    }

    const updateUser = (newRow: any, oldRow: any) => {
        let user: User | undefined = users.find(x => x.id === newRow.id)
        if (user) {
            user.firstname = newRow.firstname
            user.lastname = newRow.lastname
            user.username = newRow.username
            user.password = newRow.password
            user.roles = newRow.roles
            UserAPI.updateUser(user).then(succeeded => {
                if (succeeded) {
                    refreshPage()
                    enqueueSnackbar("Update successful.", {variant: "success"})
                    return newRow
                }
            }).catch(reason => {
                console.error("Failed to update row due to " + reason)
                enqueueSnackbar("Failed to update.", {variant: "error"})
                return oldRow
            })
        } else {
            UserAPI.addUser(newRow).then(succeeded => {
                if (succeeded) {
                    refreshPage()
                    enqueueSnackbar("Successfully added a user..", {variant: "success"})
                    return succeeded.json()
                }
            }).catch(reason => {
                console.error("Failed to add a row due to " + reason)
                enqueueSnackbar("Failed to add a user.", {variant: "error"})
                return oldRow
            })
        }
    }

    function isNullOrWhitespace( input: any ) {
        if (typeof input === 'undefined' || input == null) return true;
        return input.replace(/\s/g, '').length < 1;
    }

    return (<>
        <Box>
            <Button variant={"text"} startIcon={<AddIcon/>} onClick={handleAdd}>
                Add a new user
            </Button>
        </Box>
        <DataGrid
            columns={getColumns(user)}
            editMode="row"
            processRowUpdate={(newRow, oldRow) => {
                if(isNullOrWhitespace(newRow.username) || isNullOrWhitespace(newRow.password)){
                    enqueueSnackbar("Please fill out all of the fields.", {variant: "error"})
                } else {
                    updateUser(newRow, oldRow)
                }
                }
            }
            autoHeight={true}
            rows={users}
            loading={loading}
        />
    </>)
}
export default UserManagement
