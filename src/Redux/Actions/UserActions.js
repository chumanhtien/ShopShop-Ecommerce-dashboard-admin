import { 
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS, 
    USER_LOGIN_FAIL,
    USER_LOGOUT, 
} 
    from "../Constants/UserConstants";
import axios from "axios";
import { toast } from "react-toastify";
 
//LOGIN
export const login = (email, password) => async(dispatch) => {
    const ToastObjects = {
        pauseOnFocusLoss: false,
        draggable: false,
        pauseOnHover: false,
        autoClose: 2000,
    }
    try {
        dispatch({type: USER_LOGIN_REQUEST});
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }
        const {data} = await axios.post(
            `/api/users/login`, 
            {email, password}, 
            config
        );

        if (!data.isAdmin) {
            toast.error("You are not Admin", ToastObjects);
            dispatch({
                type: USER_LOGIN_FAIL
            })
        } else {
            dispatch({type: USER_LOGIN_SUCCESS, payload: data});  
        }

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        const message = error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: message
        });
    }
};

//LOGOUT 
export const logout = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({type: USER_LOGOUT});
    // document.location.href="/login";
}
