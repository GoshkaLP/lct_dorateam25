export const getOptionLabel = (addresses) => (option) => {
    return (
        addresses.get(option) ?? ""
    );
}