import {useRef,useEffect,useState} from 'react'
import * as faceapi from 'face-api.js'
import { redirect } from 'next/navigation';


export default function FirstStepWebCam({
    setReference,
    setCurrentStep,
}:{
    setReference: (reference:any) => void,
    setCurrentStep: (step:number) => void
}){


  const [isCameraActive, setIsCameraActive] = useState(true)
  const videoRef = useRef<any>()
  const canvasRef = useRef<any>()

  // LOAD FROM USEEFFECT
  useEffect(()=>{
    if (isCameraActive) {    
        startVideo()
        videoRef && loadModels()
    }
  },[])



  // OPEN YOU FACE WEBCAM
  const startVideo = ()=>{
    navigator.mediaDevices.getUserMedia({video:true})
    .then((currentStream)=>{
    videoRef.current.srcObject = currentStream
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  // for render and store in localstorage
  // LOAD MODELS FROM FACE API

  const loadModels = ()=>{
    if (!isCameraActive) {
        return
    }

    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),

      ]).then(()=>{
        if (isCameraActive) {
            faceMyDetect()
        }
    })
  }

  const faceMyDetect = ()=>{
    setInterval(async()=>{
      const camera = await faceapi.detectSingleFace(videoRef.current,
        new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
        
        
        if (camera!.detection.score > 0.7) {
            const jsonLabel = new faceapi.LabeledFaceDescriptors('reference',[camera?.descriptor!]).toJSON()
           
            localStorage.setItem("referenceObject", JSON.stringify(jsonLabel))
            setReference(camera)
            setCurrentStep(2)
        }
        
        
      // DRAW YOU FACE IN WEBCAM
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
      faceapi.matchDimensions(canvasRef.current,{
        width:470,
        height:325
      })

      const resized = faceapi.resizeResults(camera,{
         width:470,
        height:325
      })

      faceapi.draw.drawDetections(canvasRef.current,resized!)
      faceapi.draw.drawFaceLandmarks(canvasRef.current,resized!)

    },500)
  }

  
  return (
    <div className="flex w-screen h-screen flex-col items-center justify-center">
      <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      <canvas ref={canvasRef} width="470" height="325"
      className="absolute"/>
    </div>
    )

}