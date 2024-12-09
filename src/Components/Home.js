import React from 'react'
import {useLocation} from 'react-router-dom'

const Home = () => {
    const location = useLocation()

  return (
    <div className="homepage">
        <h1>hello {location.state.name}, and welome to the home</h1>
    </div>
  )
}

export default Home
