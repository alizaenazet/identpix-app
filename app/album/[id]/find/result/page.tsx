"use client"

import { redirect } from "next/navigation"
import { useRef,useEffect, useState } from "react"
import useSWR from 'swr'
import * as faceapi from 'face-api.js';


export default function Page({ params }: { params: { id: string } }) {
    const reference = JSON.parse(localStorage.getItem("referenceObject")!)
    
    if (reference == null) {
        redirect(`/album/${params.id}`)
    }

    const isFirstRender = useRef(true)
    const isReadyToImportModel = useRef(false)
    const [isProcess, setIsProcess] = useState(false)
    const [imagesOfMatch, setImagesOfMatch] = useState<any[]>([])
    
    // fetch images data in database
    const fetcher = (url:string) => fetch(url).then(res => res.json())
    
    const { data, error, isLoading } = useSWR(`/api/photos/spaces/get-object/${params.id}`, fetcher)


    useEffect(() => {
        // Prevent the function from executing on the first render

        if (!isFirstRender) {
            isReadyToImportModel.current = false; // toggle flag after first render/mounting
            return;
        }
        
        (async () => {
          // loading the models

          await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
          await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
          await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
          await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
          await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            
        })();
      }, []);


    if (isLoading) {
        return <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
            <p className="text-xl font-semibold"> Loading... </p>
            <p className="text-lg font-normal"> preparing album images data </p>
        </div>
    }

    if (error) {
        return <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
            <p className="text-lg font-normal"> Something wrong 🥲 </p>
        </div>
    }




      async function detect() {
        setIsProcess(true)
        const faceMatcher = new faceapi.FaceMatcher(new Float32Array(reference.descriptors[0]))
        let result : any[] = []
        let indexOfMatches: number[] = []
        for (let index = 0; index < data.result.data[0].length; index++) {
            const detections = await faceapi.detectAllFaces(`images-${index}`,new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
            detections.forEach(fd => {
                const bestMatch = faceMatcher.findBestMatch(fd.descriptor)

                if (bestMatch.toString().includes("person 1")) {
                    indexOfMatches.push(index)
                }
            })
        }

        if (indexOfMatches.length > 0) {
            setImagesOfMatch(indexOfMatches)
        }
        setIsProcess(false)
      }
      
      

  return (
    <div className='w-screen flex flex-col gap-2 items-center justify-center '>
        <p className='font-bold text-5xl mb-9'>face detect</p>
        <p className='font-medium text-xl mb-9'>total: {data.result.data[0].length} images</p>

        <button className='p-3 bg-red-100 font-bold text-blue-600' onClick={async () => {
                detect()
            }}>classify</button>
        
        {
            isProcess && <p>🔍 Processing to find your images 🔍</p>
        }   
        
        {
            (data.result.data[0].length > 0 && imagesOfMatch.length < 1) && data.result.data[0].map((id:any,index:number) => 
                <div className='mt-3' hidden={isProcess}>
                    <p className='font-black'>{index + 1}</p>
                    <img id={`images-${index}`} src={`/api/photos/forward-image/${id}`} alt=""/>
                </div>
            )
        }
        {
            (data.result.data[0].length > 0 && imagesOfMatch.length > 0) && data.result.data[0].map((id: any,index:number) => {
                if (imagesOfMatch.includes(index)) {
                    return <div className='mt-3'>
                        <p className='font-black'>{index + 1}</p>
                        <img id={`images-${index}`} src={`/api/photos/forward-image/${id}`} alt="" />
                        </div>
                    }
                }
            )
        }

       
    </div>
  )
}

