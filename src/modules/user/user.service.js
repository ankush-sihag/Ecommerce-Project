const registerUser = async (userData) => {
    console.log('Service Running');

    return{
        success: true,
        userData
    };
};

module.exports = { registerUser };