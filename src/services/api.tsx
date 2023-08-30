import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://46.101.102.239:3000/check-out',
// baseURL:'https://3d4c-2804-214-8844-992b-867b-5ff4-3013-da93.ngrok-free.app/check-out'
});

export default Api;
