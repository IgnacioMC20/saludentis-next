import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs, { tabsClasses } from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import dynamic from 'next/dynamic'
import { SyntheticEvent, useState } from 'react'

const ClinicHistory = dynamic(() => import('@/components/PatientComponents/ClinicHistory'))
const PacientInfo = dynamic(() => import('@/components/PatientComponents/PacientInfo'))
const Diagnostic = dynamic(() => import('@/components/PatientComponents/Diagnostic'))
const Diet = dynamic(() => import('@/components/PatientComponents/Diet'))
const Odontogramalol = dynamic(() => import('@/components/PatientComponents/Odontogramalol'))

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
    title: string
}

const Forms = [
    {
        title: 'Datos Personales',
        component: <PacientInfo />,
    },
    {
        title: 'Ficha Clínica',
        component: <ClinicHistory />,
    },
    {
        title: 'Dietas',
        component: <Diet />,
    },
    {
        title: 'Odontograma',
        component: <Odontogramalol />,
    },
    {
        title: 'Diagnosticos',
        component: <Diagnostic />,
    },
]

function TabPanel(props: TabPanelProps) {
    const { children, value, title, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <>
                    <Typography variant={'h4'} color={'black'} marginY={2}>{title}</Typography>
                    <Box sx={{
                        p: 3,
                    }}>
                        {children}
                    </Box>
                </>
            )}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    }
}

export const PatientTabs = () => {
    const [value, setValue] = useState(0)

    const handleChange = (_event: SyntheticEvent<any>, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box
            sx={{ display: 'flex', height: '100%', flexDirection: { xs: 'column', md: 'row' } }}
        >
            <Box
                width={{
                    xs: '100%',
                    md: '20%',
                }}
                height={{
                    xs: '200px',
                    md: 'auto',
                }}
                marginTop={2}
                sx={{
                    overflow: 'auto',
                }}>

                {/* desktop tabs */}
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical patient tabs"
                    sx={{ borderColor: 'divider', display: { xs: 'none', md: 'flex' }, marginRight: 2 }}
                >
                    {Forms.map(({ title }, index) => (
                        <Tab label={title} key={title} {...a11yProps(index)} />
                    ))}

                </Tabs>

                {/* mobile tabs */}
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    aria-label="visible arrows tabs example"
                    sx={{
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                        },
                        display: { xs: 'flex', md: 'none' },

                    }}
                >
                    {Forms.map(({ title }, index) => (
                        <Tab label={title} key={title} {...a11yProps(index)} />
                    ))}
                </Tabs>
            </Box>

            {/* Tabs */}
            <Box
                padding={0}
                width={{
                    xs: '100%',
                    md: '80%',
                }}
                sx={{
                    overflow: 'auto',
                }}>

                {
                    Forms.map(({ component, title }, index) => (
                        <TabPanel value={value} key={title} index={index} title={title}>
                            {component}
                        </TabPanel>
                    ))
                }
            </Box>
        </Box>
    )
}
