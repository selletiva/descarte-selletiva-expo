import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://46.101.102.239:3000/check-out',
  //baseURL:'https://ef80-2804-d4b-9732-700-2c1f-8747-8f5e-adb0.ngrok.io/check-out'
});

export default Api;
