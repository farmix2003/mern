import axios from "axios";

export default axios.create({
    baseURL: "https://mern-back-znvb.onrender.com",
    // baseURL: 'http://localhost:8080',
    withCredentials: true,
});



