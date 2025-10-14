import { Box, Button } from '@mui/material'

type itemOptions = {
  color: string,
  name: string
}

type ToolbarProps = {
  toolbar: {
    options: itemOptions[],
  },
  // eslint-disable-next-line no-unused-vars
  handleAction: (color: string, name: string) => void,
  color: string
}

export const Toolbar: React.FC<ToolbarProps> = ({ handleAction, toolbar, color: selectedColor }) => {
  return (
    <Box display={'flex'} justifyContent={'right'} width={'80%'}>
      {toolbar.options.map(({ color, name }) => {
        return (
          <Button
            key={name}
            onClick={() => handleAction(color, name)}
            sx={{
              color: selectedColor !== color ? color : 'white',
              backgroundColor: selectedColor === color ? color : 'white',
              border: selectedColor !== color ? `2px solid ${color}` : 'white',
              borderRadius: 5,
              margin: '0 1px',
              minWidth: '100px',
              '&:hover': {
                backgroundColor: selectedColor === color ? color : 'white',
                opacity: 0.4,
                color: selectedColor !== color ? color : 'white',
                top: '-1px',
              }
            }}
          >
            {name}
          </Button>
        )
      })}
    </Box>
  )
}
