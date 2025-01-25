import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { notificationSlice } from './reducers/notificationReducer'


export const store= configureStore({
    reducer:{
        notification: notificationSlice.reducer
    }
})
ReactDOM.createRoot(document.getElementById('root')).render(

<Provider store={store}>
    <App />
</Provider>
)