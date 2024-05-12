"use client"
import useSWR from 'swr'

export default function Page({ params }: { params: { albumId: string } }) {
    const fetcher = (url:string) => fetch(url).then(res => res.json())
    const { data, error, isLoading } = useSWR(`/api/albums/detail/${params.albumId}`, fetcher)

    if (isLoading) {
        return <div>Loading...</div>
    }

    console.log("data");
    const album = data[0]

    if (data == null) {
        return <div>Invalid Request</div>
    }
    
    console.log(album);
    
    
  return (
    <div className='w-screen h-full flex flex-col gap-1 justify-start items-center'>
        <h1 className='font-semibold text-2xl'>Setup album {album.title}</h1>
        <p>status: {album.ispublished ? "🌍 published" : "📦 draft"}</p>
    </div>
  )
}
