import React, { StrictMode} from 'react'
import { render } from 'react-dom'

import './_styles/index.scss'

const App = () => (
  <StrictMode>
      Hello
  </StrictMode>
)

render(<App />, document.getElementById('REACT_ROOT'))