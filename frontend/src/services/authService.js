import axios from 'axios';

const API_URL = '/api/users';

const register = async (userData) => {
     const response = await axios.post(API_URL + '/register', userData);
     return response.data;
};

const login = async (userData) => {
     const response = await axios.post(API_URL + '/login', userData);
     if (response.data) {
     localStorage.setItem('userInfo', JSON.stringify(response.data));
     }
     return response.data;
};

const logout = () => {
     localStorage.removeItem('userInfo');
};

const verifyEmail = async (token) => {
     const response = await axios.get(API_URL + `verifyemail/${token}`);
     return response.data;
}

const forgotPassword = async (email) => {
     const response = await axios.post(API_URL + '/forgotpassword', { email });
     return response.data;
};

const resetPassword = async (data) => {
     const { token, password } = data;
     const response = await axios.patch(API_URL + `resetpassword/${token}`, { password });
     return response.data;
};

const updateUser = async (userData, token) => {
     const config = { headers: { Authorization: `Bearer ${token}` } };
     const response = await axios.put(API_URL + 'profile', userData, config);
     if (response.data) {
          localStorage.setItem('userInfo', JSON.stringify(response.data));
     }
     return response.data;
};

const deleteUser = async (token) => {
     const config = { headers: { Authorization: `Bearer ${token}` } };
     const response = await axios.delete(API_URL + 'delete', config);
     if (response.data) {
          localStorage.removeItem('userInfo');
     }
     return response.data;
};

const changePassword = async (passwordData, token) => {
     const config = { headers: { Authorization: `Bearer ${token}` } };
     const response = await axios.put(API_URL + '/changepassword', passwordData, config);
     return response.data;
};

const authService = {
     register, login, logout, verifyEmail, forgotPassword, resetPassword, updateUser, deleteUser, changePassword,
};
export default authService;