import axios from "axios";

export default axios.create({
    baseURL: "https://mern-back-znvb.onrender.com",
    withCredentials: true,
});



