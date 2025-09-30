export const getOptionLabel = (cadastrals) => (option) => {
    return (
        cadastrals.get(option) ?? ""
    );
}