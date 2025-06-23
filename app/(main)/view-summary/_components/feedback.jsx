import React from 'react'
import Markdown from 'react-markdown'
const Feedback = ({summary}) => {
  return (
    <div className='h-[50vh] overflow-auto'>
      <Markdown>{summary}</Markdown>
    </div>
  )
}

export default Feedback
