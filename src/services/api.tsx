import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://46.101.102.239:3000/check-out',
});
export default Api;
