import React from 'react'
import AppHeader from './_components/AppHeader'

const DashLayout = ({children}) => {
  return (
    <div>
        <AppHeader/>
      {children}
    </div>
  )
}

export default DashLayout
