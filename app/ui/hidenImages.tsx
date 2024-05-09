'use client'
import * as faceapi from 'face-api.js';
import { useEffect, useRef,useState } from 'react';
import useSWR from 'swr'
import Papa from "papaparse";
// import '@tensorflow/tfjs-node';
import Image from "next/image";

export default function HidenImages() {
    const isFirstRender = useRef(true)
    const isReadyToImportModel = useRef(false)
    const fetcher = (url:string) => fetch(url).then(res => res.json())
    const { data, error, isLoading } = useSWR('/api/photos/spaces/get-object/first-test.csv', fetcher)
    const [reference, setRefence] = useState<any>()
    const [imagesOfMatch, setImagesOfMatch] = useState<any[]>([])
    const [isProcess, setIsProcess] = useState(false)
    
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
        setIsProcess(true)
        const faceMatcher = new faceapi.FaceMatcher(reference)
        let result : any[] = []
        let indexOfMatches: number[] = []
        for (let index = 0; index < data.result.data.length; index++) {
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
        setIsProcess(false)
      }
      

    //   async function insertToBlob() {
    //     const blobs = await fetchImagesAndCreateURLs(data)
    //     setBlobs(blobs)
    //   }

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
    //   const links = Papa.parse("https://gdrive-ids.sgp1.digitaloceanspaces.com/first-test.csv", {
    //     download: true,
    //     complete: function(results) {
    //         console.log("results");
    //         console.log(results);
    //     }
    // })
    //   console.log("links");
    //   console.log(links);
    // console.log("data result");
    // console.log(typeof data);
    // console.log(data);
      
    if (!data) {
        return data
    }
      


    
    return (
    <div className='w-screen flex flex-col gap-2 items-center justify-center '>
        <p className='font-bold text-5xl mb-9'>face detect</p>
        <p className='font-medium text-xl mb-9'>total: {data.length} images</p>

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
            isProcess && <p>🔍 Processing to find your images 🔍</p>
        }   
        
        {
            (data.result.data.length > 0 && imagesOfMatch.length < 1) && data.result.data.map((id:any,index:number) => 
                <div className='mt-3' hidden={isProcess}>
                    <p className='font-black'>{index + 1}</p>
                    <img id={`images-${index}`} src={`api/photos/forward-image/${id[0]}`} alt=""/>
                </div>
            )
        }
        {
            (data.result.data.length > 0 && imagesOfMatch.length > 0) && data.result.data.map((id: any,index:number) => {
                if (imagesOfMatch.includes(index)) {
                    return <div className='mt-3'>
                        <p className='font-black'>{index + 1}</p>
                        <img id={`images-${index}`} src={`api/photos/forward-image/${id[0]}`} alt="" />
                        </div>
                    }
                }
            )
        }

       
    </div>
  )
}
