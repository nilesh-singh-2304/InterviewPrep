"use client";
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import moment from 'moment';
import { useParams } from 'next/navigation'
import React from 'react'
import Chatbox from '../../DiscussionRoom/[roomid]/_components/chatbox';
import Feedback from '../_components/feedback';

const ViewSummary = () => {
    const {roomid} = useParams();
    const roomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    console.log("data",roomData)
  return (
    <div className='p-32 flex w-full justify-center items-center gap-2 border border-gray-800'>
      <div className='flex flex-col w-1/2'>
        <div>
            <div className='flex flex-col bg-white shadow-md border border-gray-400 rounded-lg p-2 m-2'>
                <h2>{roomData?.topic}</h2>
                <h2>{roomData?.category}</h2>
                <h2>{ moment(roomData?._creationTime).fromNow()}</h2>
            </div>
        </div>
        <div className='border border-gray-500 flex justify-center items-center rounded-lg p-2 m-2'>
            <Feedback summary={roomData?.summary} />
        </div>
      </div>
      <div className='border w-1/2 border-gray-500 flex justify-center items-center'>
        {roomData?.conversation ? <Chatbox conversation={roomData?.conversation} category={roomData?.category} enableFeedback={false} /> : <div>loading</div>}
      </div>
    </div>
  )
}

export default ViewSummary
