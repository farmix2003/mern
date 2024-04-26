import axios from "axios";

export default axios.create({
    method: ["GET", "POST", "DELETE", "PUT"],
    baseURL: "https://inter-paint.vercel.app",
    withCredentials: true,
});



