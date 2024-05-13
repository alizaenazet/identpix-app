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
        return <div>
            <FirstStepWebCam  // namun semua logic masih
            setCurrentStep={setCurrentStep}
            setReference={setRefence}/>
        </div>    
    }

    if (currentStep == 2) {
        return <div>
            <h1>Step to confirm the picture to be a ference</h1>
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
        <h1>The last step for start find the images</h1>
    </div>
  )
}

