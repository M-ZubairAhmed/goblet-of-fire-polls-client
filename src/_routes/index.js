import React, { StrictMode } from 'react'
import { render } from 'react-dom'

import '_styles/index.scss'

import Home from '_routes/home'

render(
  <StrictMode>
    <Home />
  </StrictMode>,
  document.getElementById('REACT_ROOT'),
)
