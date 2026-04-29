import { CheckCircle, CloudUpload, Error as ErrorIcon } from '@mui/icons-material'
import { AppBar, Box, Chip, CircularProgress, Tab, Tabs, Alert } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'

import { Toolbar } from './components/Toolbar'
import { Tooth } from './components/Tooth'
import { store } from './store'
import { useOdontogram } from '@/hooks'
import { ITooth } from '@/interfaces'

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

type AppProps = {
  patientId: string;
  showChildOdontogram?: boolean;
};

export const App: React.FC<AppProps> = ({ patientId, showChildOdontogram = false }) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [markedColor, setMarkedColor] = useState('')
  const [markedName, setMarkedName] = useState('')

  // Use the odontogram hook
  const {
    odontogram,
    loading,
    saving,
    error,
    lastSaved,
    hasChanges,
    updateFace,
    toggleTooth,
    setExtraction,
    currentState
  } = useOdontogram(patientId)

  const handleTabChange = (_event: React.ChangeEvent<object>, value: number) => {
    setSelectedTab(value)
  }

  // Change the selected color
  const handleAction = (color: string, name: string) => {
    setMarkedColor(color)
    setMarkedName(name)
  }

  // Toggle tooth presence
  const handleToggleTooth = (data: ITooth) => {
    toggleTooth(data.toothNumber)
  }

  // Paint face or set extraction
  const handleSetFace = (_face: string, index: number, data: ITooth) => {
    const action = markedColor

    if (action === '') return
    
    if (action === 'gray') {
      // Set as extraction
      setExtraction(data.toothNumber)
    } else {
      // Update face color
      const currentFace = data.faces[index]
      const newState = action === currentFace.state ? 'white' : action
      updateFace(data.toothNumber, index, newState, markedName)
    }
  }

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box padding={2}>
        <Alert severity="error" icon={<ErrorIcon />}>
          {error}
        </Alert>
      </Box>
    )
  }

  // No odontogram (shouldn't happen as hook creates it)
  if (!odontogram || !currentState) {
    return (
      <Box padding={2}>
        <Alert severity="info">
          No se pudo cargar el odontograma
        </Alert>
      </Box>
    )
  }

  // Get teeth based on dental arch type
  const adultTeeth = currentState.teeth.filter(t => t.toothNumber <= 32)
  const childTeeth = currentState.teeth.filter(t => t.toothNumber > 32)

  return (
    <div className="container">
      <main>
        {/* Auto-save indicator */}
        <Box display="flex" justifyContent="flex-end" mb={1} width="80%">
          {saving && (
            <Chip 
              icon={<CloudUpload />} 
              label="Guardando..." 
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {!saving && lastSaved && !isNaN(lastSaved.getTime()) && (
            <Chip
              icon={<CheckCircle />}
              label={`Guardado ${formatDistanceToNow(lastSaved, { addSuffix: true, locale: es })}`}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
          {!saving && hasChanges && !lastSaved && (
            <Chip 
              label="Cambios sin guardar" 
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>

        {/* Navigation and content section */}
        <Box>
          <AppBar position="static" sx={{
            backgroundColor: 'transparent',
            color: 'black',
            boxShadow: 'none',
            width: '80%',
          }}>
            {showChildOdontogram && (
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Adulto" />
                <Tab label="Niño" />
              </Tabs>
            )}
          </AppBar>

          {(selectedTab === 0 || !showChildOdontogram) && (
            <TabContainer>
              <Box
                paddingLeft={8}
                paddingTop={10}
              >
                {adultTeeth.map((item, index) => (
                  <Tooth
                    key={item.toothNumber}
                    index={index}
                    data={{
                      id: item.toothNumber,
                      name: `tooth${item.toothNumber}`,
                      status: item.status,
                      faces: item.faces.map((f, i) => ({
                        id: `${item.toothNumber}face${i + 1}`,
                        name: f.position,
                        state: f.state
                      })),
                      css: item.toothNumber === 8 ? 'spaceRight' : 
                           item.toothNumber === 16 ? 'noMarginRight' : undefined
                    }}
                    toggleTooth={() => handleToggleTooth(item)}
                    setFace={(face, idx) => handleSetFace(face, idx, item)}
                  />
                ))}
              </Box>
            </TabContainer>
          )}

          {showChildOdontogram && selectedTab === 1 && (
            <TabContainer>
              <Box
                paddingLeft={23}
                paddingTop={10}
              >
                {childTeeth.map((item, index) => (
                  <Tooth
                    key={item.toothNumber}
                    index={index}
                    data={{
                      id: item.toothNumber,
                      name: `tooth${item.toothNumber}`,
                      status: item.status,
                      faces: item.faces.map((f, i) => ({
                        id: `${item.toothNumber}face${i + 1}`,
                        name: f.position,
                        state: f.state
                      })),
                      css: item.toothNumber === 51 ? 'spaceRight' :
                           item.toothNumber === 65 ? 'noMarginRight' :
                           item.toothNumber === 85 ? 'clear' :
                           item.toothNumber === 81 ? 'spaceRight' :
                           item.toothNumber === 75 ? 'noMarginRight' : undefined
                    }}
                    toggleTooth={() => handleToggleTooth(item)}
                    setFace={(face, idx) => handleSetFace(face, idx, item)}
                  />
                ))}
              </Box>
            </TabContainer>
          )}
        </Box>

        {/* Toolbar section */}
        <Toolbar 
          toolbar={store.toolbar} 
          handleAction={handleAction} 
          color={markedColor} 
        />
      </main>
    </div>
  )
}
