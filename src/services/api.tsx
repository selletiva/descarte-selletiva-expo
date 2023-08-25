import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://3e38-2804-2e68-11-4fc0-eb89-aa7b-ad16-2f90.ngrok-free.app/check-out',
});
export default Api;
