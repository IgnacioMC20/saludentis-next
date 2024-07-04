import { createContext } from 'react'

interface ContextPros {
    isMenuOpen: boolean

    //Methods
    toggleSideMenu: () => void
}

export const UIContext = createContext({} as ContextPros)