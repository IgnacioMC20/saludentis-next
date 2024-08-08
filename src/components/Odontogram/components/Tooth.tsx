import { Add, Remove } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

import { Tooth as ToothData } from '../interfaces/Teeth'

type ToothProps = {
  index: number,
  data: ToothData,
  toggleTooth: (data: ToothData) => void,
  setFace: (face: string, index: number, data: ToothData) => void
}

export const Tooth: React.FC<ToothProps> = (props) => {
  return (
    <Box sx={{
      width: 'auto',
    }}
      className={props.data.css ? `boxTooth ${props.data.css}` : 'boxTooth'}>
      {props.data.status ?
        <IconButton className="removeButton" onClick={() => props.toggleTooth(props.data)}>
          <Remove />
        </IconButton>
        :
        <IconButton className="addButton" onClick={() => props.toggleTooth(props.data)}>
          <Add />
        </IconButton>
      }

      <Typography sx={{ textAlign: 'center' }}>{props.data.id}</Typography>
      {
        props.data.status === 'extraction' ? (

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M40.72 43.66a5.14 5.14 0 0 1-.86 1.51A9.49 9.49 0 0 0 38 49.3c-.23 1.08-.48 2.34-.71 3.47L37 54.21a1 1 0 0 1-2 0l-.86-3.52a2.21 2.21 0 0 0-4.28 0L29 54.23a1 1 0 0 1-1.95 0l-.3-1.44c-.23-1.13-.48-2.39-.71-3.47a9.5 9.5 0 0 0-1.89-4.12 5.13 5.13 0 0 1-.87-1.52 4.84 4.84 0 0 1-.28-2.13 5 5 0 0 1 6.59-4.29 7.16 7.16 0 0 0 4.77 0 5 5 0 0 1 2.09-.26A5 5 0 0 1 41 41.55a4.84 4.84 0 0 1-.28 2.11z" /><path d="M53 44a17 17 0 0 1-17 17h-8a17 17 0 0 1-17-17h10.29a3.38 3.38 0 0 0 .11.34 7.38 7.38 0 0 0 1.2 2.11 7.39 7.39 0 0 1 1.48 3.25c.23 1.08.48 2.35.72 3.47l.29 1.44a3 3 0 0 0 5.85.1l.86-3.52a.21.21 0 0 1 .4 0l.86 3.52a3 3 0 0 0 5.85-.1l.29-1.44c.24-1.12.49-2.39.72-3.47a7.38 7.38 0 0 1 1.49-3.26 7.4 7.4 0 0 0 1.19-2.1 3.38 3.38 0 0 0 .11-.34zM26.68 29.24A12 12 0 0 0 20 40a4.29 4.29 0 0 1-4.29-4.23 4 4 0 0 1 .23-1.36A17 17 0 0 1 20 28a17.9 17.9 0 0 1 1.37-1.23c.23.16.47.31.72.46a19.14 19.14 0 0 0 4.59 2.01zM51.42 7.4l-3.36 9.31a17 17 0 0 1-5.42 7.56q-.35-.25-.72-.48A19 19 0 0 0 37 21.67a9.81 9.81 0 0 0 4.34-5.26L45.23 5.2a3.28 3.28 0 1 1 6.19 2.2z" /><path d="M48.06 34.41A17 17 0 0 0 44 28a17.15 17.15 0 0 0-3.14-2.48 16.93 16.93 0 0 0-5.22-2.1 3.81 3.81 0 0 0-.55-.91 4 4 0 0 0-6.22 0 9.84 9.84 0 0 1-6.2-6.1L18.77 5.2a3.28 3.28 0 1 0-6.19 2.2l3.36 9.31a17.11 17.11 0 0 0 13.16 11 3.57 3.57 0 0 0 .55.48 4 4 0 0 0 4.7 0A12 12 0 0 1 44 40a4.25 4.25 0 0 0 4.06-5.59zM32 27a2 2 0 1 1 2-2 2 2 0 0 1-2 2z" /></svg>
        ) :
          (
            <>
              <svg width="40" height="40" id={props.data.id.toString()} className={props.data.status ? 'tooth' : 'tooth disabled'} >
                <polygon
                  stroke="red"
                  points="0,1 30,10"
                  id={props.data.faces[0].id}
                  fill={props.data.faces[0].state}
                  onClick={() => props.setFace(props.data.faces[0].id, 0, props.data)}
                  className="face"
                />
                <polygon
                  stroke="black"
                  points="0,0 40,0 30,10 10,10"
                  id={props.data.faces[0].id}
                  fill={props.data.faces[0].state}
                  onClick={() => props.setFace(props.data.faces[0].id, 0, props.data)}
                  className="face"
                />
                <polygon
                  stroke="black"
                  points="10,30 30,30 40,40 0,40"
                  id={props.data.faces[1].id}
                  fill={props.data.faces[1].state}
                  onClick={() => props.setFace(props.data.faces[1].id, 1, props.data)}
                  className="face"
                />
                <polygon
                  stroke="black"
                  points="30,10 40,0 40,40 30,30"
                  id={props.data.faces[2].id}
                  fill={props.data.faces[2].state}
                  onClick={() => props.setFace(props.data.faces[2].id, 2, props.data)}
                  className="face"
                />
                <polygon
                  stroke="black"
                  points="0,0 10,10 10,30 0,40"
                  id={props.data.faces[3].id}
                  fill={props.data.faces[3].state}
                  onClick={() => props.setFace(props.data.faces[3].id, 3, props.data)}
                  className="face"
                />
                <polygon
                  stroke="black"
                  points="10,10 30,10 30,30 10,30"
                  id={props.data.faces[4].id}
                  fill={props.data.faces[4].state}
                  onClick={() => props.setFace(props.data.faces[4].id, 4, props.data)}
                  className="face"
                />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" className={!props.data.status ? 'tooth' : 'tooth disabled'}>
                <path fill="rgb(228, 102, 102)" d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
              </svg>
            </>
          )
      }

    </Box>
  )
}
