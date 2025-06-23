
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { AiModelFeedback } from '@/services/Glo'
import { useMutation } from 'convex/react'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const Chatbox = ({ conversation, category, enableFeedback }) => {
  const [loading, setLoading] = useState(false)
  console.log(conversation)

  const updateSummmary = useMutation(api.DiscussionRoom.updateSummary)
  const {roomid} = useParams();
  console.log(roomid)
  const generateFeedback = async () => {
    setLoading(true)
    try {
      const result = await AiModelFeedback(category, conversation)  // Ensure it's awaited
      console.log(result)
      setLoading(false)
      await updateSummmary({
        id: roomid,
        summary: result.choices[0].message.content,
      })
      toast('Feedback generated successfully!')
    } catch (error) {
      setLoading(false)
      toast('Error generating feedback. Please try again.')
    }
    
  }

  return (
    <div>
      <div className="relative border h-[60vh] rounded-4xl flex flex-col bg-gray-200 border-black p-5 overflow-auto scrollbar-hidden scroll-smooth">
        {conversation.map((item, index) => (
          <div key={index} className={`mb-2 flex ${item.role === 'user' ? 'justify-end' : ''}`}>
            <h2
              className={`p-1 px-2 inline-block rounded-lg ${
                item.role === 'assistant' ? 'bg-primary text-white' : 'bg-black text-white'
              }`}
            >
              {item?.content}
            </h2>
          </div>
        ))}
      </div>
      {!enableFeedback ? (
        <h2>You have reached the end of the conversation</h2>
      ) : (
        <Button onClick={generateFeedback} disabled={loading} className="flex items-center gap-2">
          {loading && <LoaderCircle className="animate-spin w-4 h-4" />} 
          Get Feedback
        </Button>
      )}
    </div>
  )
}

export default Chatbox
