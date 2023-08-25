import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://bebf-198-17-121-248.ngrok-free.app/check-out',
});
export default Api;
