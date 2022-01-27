import {useEffect, useState} from 'react';

export const useFetch = (url: string) => {
  const [data, setData] = useState<any>(undefined)
  const [error, setError] = useState<any>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    const fetchData = async (url:string) =>{
      try{
        setIsLoading(true)
        const response = await fetch(url);
        const dataFromResponse = await response.json();
        setData(dataFromResponse)
      } catch(err){
        setError(error)
      } finally{
        setIsLoading(false)
      }
    }

    fetchData(url)

  },[url])
  return {data, error, isLoading}
};
