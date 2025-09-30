import {useMemo, useState} from "react";
import {CircularProgress, debounce} from "@mui/material";
import {getOptionLabel} from "./utils";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as React from "react";

export const AreaField = ({ value, onChange, options, areas, loading }) => {
    const [filterKeyword, setFilterKeyword] = useState("");

    const debouncedSetter = useMemo(
        () => debounce((keyword) => setFilterKeyword(keyword), 500),
        []
    );

    return <Autocomplete
        size="small"
        value={value}
        multiple
        loading={loading}
        onChange={onChange}
        options={options}
        onInputChange={(_, newInputValue) => debouncedSetter(newInputValue)}
        // filterOptions={(x) => x} // Disable the default filtering as we handle it ourselves
        getOptionLabel={getOptionLabel(areas)}
        renderInput={(params) => (
            <TextField {...params} variant="filled" label="Район" id="" />
        )}
    />
}