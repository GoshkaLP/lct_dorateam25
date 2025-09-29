import React from "react";

const useForceUpdateGeoJson = (dependency) => {
    const [key, setKey] = React.useState(0);

    React.useEffect(() => {
        // Update the key when dependency data changes
        setKey((prevKey) => prevKey + 1);
    }, [dependency]);

    return key
}

export default useForceUpdateGeoJson;