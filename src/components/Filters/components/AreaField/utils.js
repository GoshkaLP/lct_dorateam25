export const getOptionLabel = (areas) => (option) => {
    return (
        areas.get(option) ?? ""
    );
}