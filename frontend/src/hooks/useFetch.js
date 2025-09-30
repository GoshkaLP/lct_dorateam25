import {useEffect, useState} from 'react';

const useFetch = (url)=> {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(url); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    return { data, loading, error }
}

export default useFetch