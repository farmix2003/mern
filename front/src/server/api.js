import axios from "axios"

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post('https://inter-paint.vercel.app/api/users/login', { email, password });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Request failed with status code:', error.response.status);
            console.error('Response data:', error.response.data);
            throw new Error('Failed to login: ' + error.response.data.error);
        } else if (error.request) {

            console.error('No response received:', error.request);
            throw new Error('Failed to login: No response received');
        } else {
            console.error('Error setting up the request:', error.message);
            throw new Error('Failed to login: ' + error.message);
        }
    }
};

export const registerUser = async (name, email, password) => {
    try {
        const response = await axios.post('https://inter-paint.vercel.app/api/users/register', { name, email, password })
        return response.data
    } catch (e) {
        console.log('Failed to register')
    }
}

export const getUsers = async () => {
    try {
        const response = await axios.get('https://inter-paint.vercel.app/api/users/get-users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            console.error('Request failed with status code:', error.response.status);
            console.error('Response data:', error.response.data);
            throw new Error('Failed to get users: ' + error.response.data.error);
        } else if (error.request) {
        }
    }
}

export const deleteUser = async (ids) => {
    try {
        const response = await axios.delete(`https://inter-paint.vercel.app/api/users/delete`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            data: { ids }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            console.error('Request failed with status code:', error.response.status);
            console.error('Response data:', error.response.data);
            throw new Error('Failed to delete user: ' + error.response.data.error);
        } else if (error.request) {
        }
    }
}

export const blockUser = async (ids) => {
    try {
        const response = await axios.put('https://inter-paint.vercel.app/api/users/block', { ids }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },

        })
        return response.data
    } catch (error) {
        if (error.response) {
            console.error('Request failed with status code:', error.response.status);
            console.error('Response data:', error.response.data);
            throw new Error('Failed to block user: ' + error.response.data.error);
        } else if (error.request) {
        }
    }
}


export const unblockUser = async (ids) => {
    try {
        const response = await axios.put('https://inter-paint.vercel.app/api/users/unblock', { ids }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            console.error('Request failed with status code:', error.response.status);
            console.error('Response data:', error.response.data);
            throw new Error('Failed to unblock user: ' + error.response.data.error);
        } else if (error.request) {
        }
    }
}

export const logoutUser = async () => {
    try {
        await axios.post('https://inter-paint.vercel.app/api/users/logout', null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        localStorage.removeItem('accessToken');
    } catch (error) {
        console.log('Failed to logout', error);
    }
}
