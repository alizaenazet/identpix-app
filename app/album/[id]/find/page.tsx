"use client"
import { useState,useEffect,useRef } from 'react'
import * as faceapi from 'face-api.js';
import FirstStepWebCam from "@/app/ui/finding/firstStepWebCam";
import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {

    const [currentStep,setCurrentStep] = useState(1)
    const isFirstRender = useRef(true)
    const [reference, setRefence] = useState<any>()
    const isReadyToImportModel = useRef(false)

    if (currentStep == 2) {
        redirect(`/album/${params.id}/find/result`)
    }
    if (currentStep == 1) { // saat telah tidak sesuai halaman tidak ditampilakn
        return <div className='w-screen h-screen flex flex-col items-center justify-center py-3 px-2 gap-6'>
            <p className='w-full text-center text-base font-semibold'>Open the camera so we can detect your face</p>
            <FirstStepWebCam
            albumId={params.id}  // namun semua logic masih
            setCurrentStep={setCurrentStep}
            setReference={setRefence}/>
            <p className='w-full text-center font-normal text-sm text-slate-600'>Point your face at the camera and then we will detect your face, make sure you are in good lighting and conditions.</p>
        </div>    
    }


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

    
  return (
    <div>
        
    </div>
  )
}

