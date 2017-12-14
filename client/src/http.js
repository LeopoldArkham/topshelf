import axios from "axios";

var http = axios.create({
    baseURL: "http://localhost:3100",
    withCredentials: true
  });

  export default http;