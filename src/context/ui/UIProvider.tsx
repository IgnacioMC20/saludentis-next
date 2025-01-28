import { FC, useReducer } from 'react'

import { UIContext, uiReducer } from './'

export interface UIState {
    isModalOpen: boolean
    isMenuOpen: boolean
}

const UI_INITIAL_STATE: UIState = {
    isModalOpen: false,
    isMenuOpen: false
}

export const UIProvider: FC<{ children: React.ReactNode }> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

    const toggleModal = () => dispatch({ type: '[UI] - ToggleModal' })
    const toggleSideMenu = () => dispatch({ type: '[UI] - ToggleMenu' })

    return (
        <UIContext.Provider value={{
            ...state,

            //Methods
            toggleModal,
            toggleSideMenu
        }}>
            {children}
        </UIContext.Provider>
    )
}