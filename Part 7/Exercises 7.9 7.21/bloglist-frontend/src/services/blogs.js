import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const CreateBlog = async (data,auth) =>{
  const request = await axios.post(baseUrl,data,{headers:{'Authorization':"Bearer "+auth}})
  return request.data

}

const IncreaseLikes = async(id,data,auth)=>{
  const request = await axios.patch(baseUrl+"/"+id,data,{headers:{'Authorization':"Bearer "+auth}})

}

const EliminateBlog = async(id,auth)=>{
  const request = await axios.delete(baseUrl+"/"+id,{headers:{'Authorization':"Bearer "+auth}})

}



export default { getAll,CreateBlog,IncreaseLikes,EliminateBlog}