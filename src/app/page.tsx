'use client'

import React, { useEffect, useState } from 'react'
export const dynamic = "force-dynamic";

import Header from '@/components/Header';
import Category from '@/components/Category';
import LineupCard from '@/components/LineupCard';
import Footer from '@/components/Footer';

import SongCard from '@/components/SongCard';
import { Song } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { isUserStored} from '@/lib/serverHelper';
import { loginIsRequiredClient } from '@/lib/clientHelper';







export default function Home() {

  const session = useSession();
  const router = useRouter()

  




  const [songs, setSongs] = useState<Array<Song>>([])
  
  const [sunday, setSunday] = useState<string>('')
  const [sundayDate, setSundayDate] = useState<Date>()

  useEffect(() => {
    const checkUser = async () => {
      if(session.status === 'authenticated') await isUserStored()
    }

    checkUser()
  }, [session])

  useEffect(() => {

    const fetchData = async () => {
      
      const res = await fetch('/api/song')
      const data : Array<Song> = await res.json()

      setSongs(data)
    }
    
      fetchData()

      const currentDate = new Date()
      const daysUntilSunday = 7 - currentDate.getDay()
      const upcomingSunday = new Date(currentDate)
      upcomingSunday.setDate(currentDate.getDate() + daysUntilSunday)
      
      setSundayDate(upcomingSunday)
    

  } ,[])

  useEffect(() => {
    setSunday(sundayDate?.toLocaleDateString("en-US", {weekday : 'long', month : 'long', day : 'numeric', year : 'numeric'}) || '')
    
  }, [sundayDate])

  const cards = songs.length > 0 ? 
    songs.map((song) => {

      return <SongCard onClick={(e) => {
        router.push(`/song/${song.id}`)
      }} artist={song.artist} lyrics={song.lyrics} title={song.title} key={song.id}/>
    })
  : <div className='w-full h-[200px] flex items-center justify-center'><p className='font-bold text-gray-400 text-2xl text-center font-montserrat'>There are no songs.</p></div>

  const preludeCards = songs.length > 0 ? 
  songs.map((song, index) => {
    const date = sundayDate?.toISOString().substring(10, 0)
    const linupDate = song.lineupDate ? new Date(song.lineupDate).toISOString().substring(10, 0) : ''

    if(song.linupType !== "PRELUDE" || date !== linupDate){
      return null
    }

    return <LineupCard onClick={(e) => {
      router.push(`/song/${song.id}`) 
    }} color={index % 2 === 0 ? 'bg-primary' : 'bg-secondary'} artist={song.artist} title={song.title} key={song.id}/>
  })
: []

  const responseCards = songs.length > 0 ? 
  songs.map((song, index) => {
    const date = sundayDate?.toISOString().substring(10, 0)
    const linupDate = song.lineupDate ? new Date(song.lineupDate).toISOString().substring(10, 0) : ''

    if(song.linupType !== "RESPONSE" || date !== linupDate){
      return null
    }

    return <LineupCard onClick={(e) => {
      router.push(`/song/${song.id}`) 
    }} color={index % 2 === 0 ? 'bg-primary' : 'bg-secondary'} artist={song.artist} title={song.title} key={song.id}/>
  })
  : []

  const adultCards = songs.length > 0 ? 
  songs.map((song, index) => {
    const date = sundayDate?.toISOString().substring(10, 0)
    const linupDate = song.lineupDate ? new Date(song.lineupDate).toISOString().substring(10, 0) : ''

    if(song.linupType !== "ADULT" || date !== linupDate){
      return null
    }

    return <LineupCard onClick={(e) => {
      router.push(`/song/${song.id}`) 
    }} color={index % 2 === 0 ? 'bg-primary' : 'bg-secondary'} artist={song.artist} title={song.title} key={song.id}/>
  })
  : []

  const youthCards = songs.length > 0 ? 
  songs.map((song, index) => {
    const date = sundayDate?.toISOString().substring(10, 0)
    const linupDate = song.lineupDate ? new Date(song.lineupDate).toISOString().substring(10, 0) : ''

    if(song.linupType !== "YOUTH" || date !== linupDate){
      return null
    }

    return <LineupCard onClick={(e) => {
      router.push(`/song/${song.id}`) 
    }} color={index % 2 === 0 ? 'bg-primary' : 'bg-secondary'} artist={song.artist} title={song.title} key={song.id}/>
  })
  : []


    return(
      <div className='min-w-[360px] max-w-[2160px] w-full flex gap-8 flex-col items-center overflow-x-visible'>
      <Header/>
      <div className='w-full relative flex flex-col gap-8'>
        <div className='w-full px-6 flex gap-2 flex-col'>
          <p className='font-montserrat text-2xl font-bold tracking-wide'>Songs</p>
          <div className='w-full flex overflow-x-scroll gap-4'>
              {cards}
          </div>
        </div>
        <div className='w-full h-14 bg-gray-100 flex justify-center items-center'>
          <p className='font-montserrat md:text-xl  font-bold'>Line-Up for: {sunday}</p>
        </div>
        <Category title={"Prelude"} cards={preludeCards.every(element => element === null) ? [] : preludeCards}/>
        <Category title={"Response"} cards={responseCards.every(element => element === null) ? [] : responseCards}/>
        <Category title={"Adult Line-Up"} cards={adultCards.every(element => element === null) ? [] : adultCards}/>
        <Category title={"Youth Line-Up"} cards={youthCards.every(element => element === null) ? [] : youthCards}/>
        <div className='w-full h-20 md:h-40'></div>
      </div>
      
      <Footer/>
  </div> )
  
  
  
}
