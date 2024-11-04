export const getSelectedSkin = () => {
    return localStorage.getItem('selectedSkin' || 'default');
}

export const getSelectedDifficulty = () => {
    return localStorage.getItem('difficulty')
}