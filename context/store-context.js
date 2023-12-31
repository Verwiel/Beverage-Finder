import { createContext, useContext, useReducer } from 'react'

export const StoreContext = createContext()
export const useStore = () => useContext(StoreContext)

export const ACTION_TYPES = {
  SET_LAT_LONG: 'SET_LAT_LONG',
  SET_HIDE_CHAINS: 'SET_HIDE_CHAINS',
  SET_OPEN_NOW: 'SET_OPEN_NOW',
  SET_STORES: 'SET_STORES'
}

const storeReducer = (state, action) => {
  switch(action.type){
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong }
    }

    case ACTION_TYPES.SET_HIDE_CHAINS: {
      return { ...state, hideChains: action.payload.hideChains }
    }

    case ACTION_TYPES.SET_OPEN_NOW: {
      return { ...state, isOpen: action.payload.isOpen }
    }

    case ACTION_TYPES.SET_STORES: {
      return { ...state, stores: action.payload.stores }
    }

    default: 
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: '',
    hideChains: true,
    isOpen: true,
    stores: [],
  }

  const [state, dispatch] = useReducer(storeReducer, initialState)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}


export default StoreProvider
