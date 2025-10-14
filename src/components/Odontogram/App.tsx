import { AppBar, Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'

import { Toolbar } from './components/Toolbar'
import { Tooth } from './components/Tooth'
import { Face } from './interfaces/Teeth'
import { Tooth as ToothData } from './interfaces/Teeth'
import { store } from './store'

type TabContainerProps = {
  children: React.ReactNode;
};

const TabContainer: React.FC<TabContainerProps> = ({ children }) => {
  return (
    <Box sx={{ padding: 0, height: '400px' }}>
      {children}
    </Box>
  )
}

export const App = () => {
  const [state, setState] = useState({ ...store, marked: { selected: '', color: '' } })
  const [selectedTab, setSelectedTab] = useState(0)

  const handleChange = (_event: React.ChangeEvent<object>, value: number) => {
    setSelectedTab(value)
  }

  // Change the selected color
  const handleAction = (color: string, name: string) => {
    setState(prevState => ({ ...prevState, marked: { selected: name, color: color } }))
  }

  // Toogle - add or remove tooth
  const toggleTooth = (data: ToothData) => {
    setState(prevState => {
      const updatedChild = prevState.dentalArch.child.map(item =>
        item.id === data.id ? { ...item, status: !item.status } : item
      )
      const updatedAdult = prevState.dentalArch.adult.map(item =>
        item.id === data.id ? { ...item, status: !item.status } : item
      )
      return {
        ...prevState,
        dentalArch: {
          child: updatedChild,
          adult: updatedAdult
        }
      }
    })
  }

  // Paint face
  const setFace = (_face: string, index: number, data: ToothData) => {
    const action = state.marked.color

    let updatedData = data

    if (action === '') return
    if (action === 'gray') {
      updatedData = {
        ...data,
        status: 'extraction',
      }
    } else {
      updatedData = {
        ...data,
        faces: data.faces.map((f: Face, i: number) =>
          i === index ? { ...f, state: action === f.state ? 'white' : action } : f
        )
      }
    }

    setState(prevState => ({
      ...prevState,
      dentalArch: {
        child: prevState.dentalArch.child.map(d => d.id === data.id ? updatedData : d),
        adult: prevState.dentalArch.adult.map(d => d.id === data.id ? updatedData : d)
      }
    }))
  }

  return (
    <div className="container">
      <main>
        {/* Navigation and content section */}
        <Box>
          <AppBar position="static" sx={{
            backgroundColor: 'transparent',
            color: 'black',
            boxShadow: 'none',
            width: '80%',
            // borderBottom: '1px solid #e0e0e0'
          }}>
            <Tabs value={selectedTab} onChange={handleChange}>
              <Tab label="Adulto" />
              <Tab label="Niño" />
            </Tabs>
          </AppBar>

          {selectedTab === 0 && (
            <TabContainer>
              <Box
                paddingLeft={8}
                paddingTop={10}
              >
                {state.dentalArch.adult.map((item, index) => (
                  <Tooth
                    key={item.id}
                    index={index}
                    data={item}
                    toggleTooth={toggleTooth}
                    setFace={setFace}
                  />
                ))}
              </Box>
            </TabContainer>
          )}

          {selectedTab === 1 && (
            <TabContainer>
              <Box
                paddingLeft={23}
                paddingTop={10}
              >
                {state.dentalArch.child.map((item, index) => (
                  <Tooth
                    key={item.id}
                    index={index}
                    data={item}
                    toggleTooth={toggleTooth}
                    setFace={setFace}
                  />
                ))}
              </Box>
            </TabContainer>
          )}
        </Box>

        {/* Toolbar section */}
        <Toolbar toolbar={state.toolbar} handleAction={handleAction} color={state.marked.color} />
      </main>
    </div>
  )
}
