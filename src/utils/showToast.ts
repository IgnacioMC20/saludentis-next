import { toast } from 'react-toastify'

export const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    toast(message, {
        position: 'top-right',
        autoClose: 2000,
        pauseOnFocusLoss: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'light',
        type,
        closeButton: false
    })
}