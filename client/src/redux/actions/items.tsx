import { CREATE, END_LOADING, FETCH_ALL, START_LOADING, UPDATE } from '../actionTypes/index'
import * as api from '../api/index'
export const createItem=(item:any,router:any)=>async(dispatch:any)=>{
    try {
        dispatch({type:START_LOADING})
        const {data}= await api.createItem(item)
        dispatch({type:CREATE,payload:data})
        router.push('/invoices')
        console.log(data)
        dispatch({type:END_LOADING})
    } catch (error) {
        console.log(error)
    }
}
export const updateItem=(id:String,item:any,router:any)=>async(dispatch:any)=>{
    try {
        dispatch({type:START_LOADING})
        const {data}= await api.updateItem(id,item)
        dispatch({type:UPDATE,payload:data})
        router.push('/')
        dispatch({type:END_LOADING})
    } catch (error) {
        console.log(error)
    }
}


export const createAdditionalFields=(additionalFields:any,router:any)=>async(dispatch:any)=>{
    try {
        dispatch({type:START_LOADING})
        const {data}= await api.createAdditionalFields(additionalFields)
        dispatch({type:CREATE,payload:data})
        // router.push('/invoices')
        dispatch({type:END_LOADING})
    } catch (error) {
        console.log(error)
    }
}

export const fetchAdditionalFieldsByCompanyId=(companyId:String)=>async(dispatch:any)=>{
    try {
        try {
            const {data}= await api.fetchAdditionalFieldsByCompanyId(companyId)
            return data
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
}

