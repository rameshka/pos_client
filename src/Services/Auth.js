
const isUser = ()=>{
    let isauth = window.localStorage.getItem('authToken');
    if( isauth!==null){
        return isauth;
    }else {
        return false;
    }
};

const setUser = (token) => {
    window.localStorage.setItem('authToken', token);
};

export {
    setUser,
    isUser
}