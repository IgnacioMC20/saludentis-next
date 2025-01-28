import { createContext } from 'react'

interface ContextPros {
    isModalOpen: boolean
    isMenuOpen: boolean

    //Methods
    toggleModal: () => void
    toggleSideMenu: () => void
}

export const UIContext = createContext({} as ContextPros)