import { UIState } from './UIProvider'

type UIActionType =
    | { type: '[UI] - ToggleModal' }
    | { type: '[UI] - ToggleMenu' }

export const uiReducer = (state: UIState, action: UIActionType): UIState => {
    switch (action.type) {
        case '[UI] - ToggleModal':

            return {
                ...state,
                isModalOpen: !state.isModalOpen
            }

        case '[UI] - ToggleMenu':

            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            }

        default:
            return state
    }
}