import axios from 'axios'
export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem('zf_city'))
  if(!localCity){
    return new Promise((resolve,reject)=>{
      const curCity = new window.BMap.LocalCity()
    
      curCity.get(async res =>{
        try{
          const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
          localStorage.setItem('zf_city',JSON.stringify(result.data.body))
          resolve(result.data.body)
        }catch(e){
          reject(e)
        }
      })
    })
  }

  return Promise.resolve(localCity)
}

export { BASE_URL } from './url'
export {API} from './api'
export * from './anth'
