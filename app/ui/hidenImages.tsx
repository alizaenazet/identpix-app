'use client'
import * as faceapi from 'face-api.js';
import { useEffect, useRef,useState } from 'react';
import useSWR from 'swr'
// import '@tensorflow/tfjs-node';
import Image from "next/image";

export default function HidenImages() {
    const isFirstRender = useRef(true)
    const isReadyToImportModel = useRef(false)
    const fetcher = (url:string) => fetch(url).then(res => res.json())
    const { data, error, isLoading } = useSWR('/api/photos', fetcher)
    const [blobs,setBlobs] = useState<any[]>([])
    const [reference, setRefence] = useState<any>()
    const [imagesOfMatch, setImagesOfMatch] = useState<any[]>([])
    
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
            
        console.log("finish load the model");
        })();
      }, []);

      
      async function detect() {
        const faceMatcher = new faceapi.FaceMatcher(reference)
        let result : any[] = []
        let indexOfMatches: number[] = []
        for (let index = 0; index < blobs.length; index++) {
            const detections = await faceapi.detectAllFaces(`images-${index}`,new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
            console.log("\n\n=====\nresult for image " + (index + 1));
            console.log(detections);
            detections.forEach(fd => {
                const bestMatch = faceMatcher.findBestMatch(fd.descriptor)

                if (bestMatch.toString().includes("person 1")) {
                    console.log("\n======\n✅ Match ");
                    console.log(`image number ${index + 1}`)
                    console.log(bestMatch.toString())
                    console.log("\n======");
                    indexOfMatches.push(index)
                }
            })
        }

        console.log("🔥\n🔥\n🔥\n🔥 result of faces 🔥")
        console.log(result)
        if (indexOfMatches.length > 0) {
            setImagesOfMatch(indexOfMatches)
        }
      }
      

      async function insertToBlob() {
        const blobs = await fetchImagesAndCreateURLs(data)
        setBlobs(blobs)
      }

      async function fetchImagesAndCreateURLs(imageUrls:string[]) {
        const urls = await Promise.all(imageUrls.map(async (imageUrl) => {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }));
        return urls;
      }

      async function initReference() {
        console.log("current reference state");
        console.log(reference ?? "empty");
        

        const referenceImage = await faceapi.detectAllFaces(`reference-image`,new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (!referenceImage.length) {
            console.log("failed detect reference");
            return
        }
        setRefence(referenceImage)

        console.log("after reference state");
        console.log(reference ?? "empty");
      }

      if (isLoading) return <div>loading...</div>
      if (blobs.length < 1 && data.length > 0) {
          insertToBlob() // problem will create as always changes 
      }   
    return (
    <div className='w-screen flex flex-col gap-2 items-center justify-center '>
        <p className='text-medium text-5xl mb-9'>face detect {blobs.length}</p>

        <div>
            {reference && <Image 
            src={"/images/sheldon.jpg"}
            width={300}
            height={300}
            alt='sheldon'
            id='reference-image'
            className='p-3 bg-green-400'
            />}
            {!reference && <Image 
            src={"/images/sheldon.jpg"}
            width={300}
            height={300}
            alt='sheldon'
            id='reference-image'
            />}
            <p className='text-bold text-sm mb-11'>reference image</p>
        </div>

        <button className='mb-3 p-3 bg-green-100 font-bold text-green-600'
        onClick={ async () => {
            await initReference()
        }}
        >
            select refence
        </button>

        <button className='p-3 bg-red-100 font-bold text-blue-600' onClick={async () => {
                detect()
            }}>classify</button>
        {
            (data.length > 0 && imagesOfMatch.length < 1) && blobs.map((url: string,index:number) => 
                <div className='mt-3'>
                    <p className='font-black'>{index + 1}</p>
                    <img id={`images-${index}`} src={url} alt=""/>
                </div>
            )
        }
        {
            (data.length > 0 && imagesOfMatch.length > 0) && blobs.map((url: string,index:number) => {
                if (imagesOfMatch.includes(index)) {
                    return <div className='mt-3'>
                        <p className='font-black'>{index + 1}</p>
                        <img id={`images-${index}`} src={url} alt=""/>
                        </div>
                    }
                }
            )
        }
    </div>
  )
}
