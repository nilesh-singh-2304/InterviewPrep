"use client"
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react'
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const History = () => {
  const convex = useConvex();
  const [roomList, setroomList] = useState()
  const uid = JSON.parse(localStorage.getItem('userData'))._id
  console.log("uid",uid)
  useEffect(() => {
    uid&&getDiscussionRooms();
  }, [uid])
  const getDiscussionRooms = async () => {
    const res = await convex.query(api.DiscussionRoom.GetAllDiscussionRoom,{
      uid:uid
    })
    console.log("res",res)
    setroomList(res)
  }
  //( item.category ==='Lecture' || item.category ==='Language Skill') &&
  return (
    <div>
      <div className='text-xl font-bold'>Your Previous Lectures</div>
      { roomList?.length==0 && <div className='text-gray-500'>You dont have any prev history</div>}

      <div>
        {roomList?.map((item,index)=> ( item.category ==='Lecture on Topic' || item.category ==='Language skill') &&  (
            <Link href={`/DiscussionRoom/${item._id}`} key={index} className='cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out'>
              <div className='hover:scale-105 transition-all duration-200 ease-in-out'>
                <div key={index} className='flex flex-col bg-white shadow-md border border-gray-400 rounded-lg p-2 m-2'>
                    <h2>{item.topic}</h2>
                    <h2>{item.category}</h2>
                    <h2>{ moment(item._creationTime).fromNow()}</h2>
                </div>
              </div>
            </Link>
        ))}
      </div>

    </div>
  )
}

export default History
