import React from 'react'
import { useLocation } from 'react-router-dom'

const Admin = () => {
    const location = useLocation()
  return (
    <div className="homepage">
        <h1>hello {location.state.name}, and welome to the Admin Page</h1>
    </div>
  )
}

export default Admin
