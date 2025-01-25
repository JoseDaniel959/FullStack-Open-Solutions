import axios from "axios";
const baseURL = "http://localhost:3000/api/login"

const login = async credentials =>{
    const {data} = await axios.post(baseURL,credentials)
    return data
}

export default {login} 