import React, { StrictMode } from 'react'
import { render } from 'react-dom'

import '_styles/index.scss'

import { GobletSVG } from '_common/svgs'
const Home = () => {
  return (
    <div>
      Home
      <GobletSVG />
    </div>
  )
}

render(
  <StrictMode>
    <Home />
  </StrictMode>,
  document.getElementById('REACT_ROOT'),
)
