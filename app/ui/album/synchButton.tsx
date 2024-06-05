"use client"
import { synchAlbumFiles, uploadAlbumJson } from '@/app/lib/actions'
import { Button } from '@/components/ui/button'
import { useRef,useEffect, useState } from "react"
import * as faceapi from 'face-api.js';
import { useRouter } from 'next/router';
import { FaceLabel } from '@/app/definitions/types';
import { signOut } from 'next-auth/react';

export default function SynchButton(
    {
        isPublished, 
        gdrive_id, 
        albumId, 
        setIsLoadingSynchronize,
        isLoadingSynchronize
    }:{
        isPublished: boolean,
        gdrive_id: string, 
        albumId:string, 
        setIsLoadingSynchronize: (val:boolean) => void,
        isLoadingSynchronize: boolean
    }) 
    {

    const [processedImagesCount, setProcessedImagesCount] = useState(0);
    const [allImagesProcessed, setAllImagesProcessed] = useState(false);
    const [imageIds,setImageIds] = useState<string[]>([])
    const [labeledDescriptors, setLabeledDescriptors] = useState<faceapi.LabeledFaceDescriptors[]>([])
    const [facesLabels, setFacesLabels] = useState<Map<number, FaceLabel>>(new Map());
    const isFirstRender = useRef(true)
    const isReadyToImportModel = useRef(false)
    
    const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const BATCH_SIZE = 5;

    // const facesLabels = new Map<number, FaceLabel>();
    useEffect(() => {
        // Prevent the function from executing on the first render

        if (!isFirstRender) {
            isReadyToImportModel.current = false; // toggle flag after first render/mounting
            useRouter().reload()
            return;
        }
        

        (async () => {
          // loading the models

            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        //   await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        })();
    }, []);

    useEffect(() => {
        const fetchAndProcessImage = async (url:string) => {
            try {
            const tempImage = await faceapi.fetchImage(`/api/photos/forward-image/${url}`)
            tempImage.id = url
            // get the image
            await processImage(tempImage as unknown as HTMLImageElement);
          } catch (error) {
            console.error('Fetch image failed:', error);
          } finally {
          }
        };
    
        const processImage = async (imageBlob: HTMLImageElement) => {
          try {
            // TODO: call descriptor function

            
            const results = await faceapi
            .detectAllFaces(imageBlob)
            .withFaceLandmarks()
            .withFaceDescriptors()
            
            if (labeledDescriptors.length < 1) {
                
                results.forEach((fd,i) => {
                    const tempNewLabel = labeledDescriptors.length
                    labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(
                        tempNewLabel.toString(),
                        [fd.descriptor]
                    )) 

                    const tempNewFacesLabels: FaceLabel = {
                        label: tempNewLabel,
                        descriptors: undefined,
                        imageIds: [imageBlob.id]
                    };
        
                    facesLabels.set(tempNewLabel, tempNewFacesLabels);  
                })

                
            }

            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
            
            results.forEach((fd,i) => {
            const bestMatch = faceMatcher.findBestMatch(fd.descriptor)

            if (bestMatch.label == "unknown" || bestMatch.distance >= 0.52) {
                const tempNewLabel = labeledDescriptors.length
                labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(
                    (tempNewLabel).toString(),
                    [fd.descriptor]
                )) 


                let tempNewFacesLabels : FaceLabel = {
                    label: tempNewLabel,
                    descriptors: undefined,
                    imageIds: [imageBlob.id]
                }

                facesLabels.set(tempNewLabel, tempNewFacesLabels);
                
            }else{
                const labelIndex = parseInt(bestMatch.label);
                if (bestMatch.distance <= 0.35) {
                    labeledDescriptors[labelIndex].descriptors.push(fd.descriptor)
                }
                

                if (facesLabels.has(labelIndex)) {
                    const existingFaceLabel = facesLabels.get(labelIndex)!;
                    const updatedImageIds = [...existingFaceLabel.imageIds, imageBlob.id];
                    const updatedFaceLabel = { ...existingFaceLabel, imageIds: updatedImageIds };
                    facesLabels.set(labelIndex, updatedFaceLabel);
                } else {
                }
            }

            })
            
          } catch (error) {
            console.error('Process image failed:', error);
          }finally {
            setProcessedImagesCount(prevCount => prevCount + 1);
          }
        };
        
        const processBatch = async () => {
            setIsProcessing(true);
            const batch = imageIds.slice(currentBatchIndex, currentBatchIndex + BATCH_SIZE);
            for (const url of batch) {
              await fetchAndProcessImage(url);
            }
            setIsProcessing(false);
            setCurrentBatchIndex(prevIndex => prevIndex + BATCH_SIZE);
          };
      
          if (isLoadingSynchronize && !isProcessing && currentBatchIndex < imageIds.length) {
            processBatch();
          }
      }, [imageIds, isProcessing, currentBatchIndex]); // Dependencies: dijalankan ulang jika `imageIds` berubah
    
      // Effect untuk memantau apakah semua gambar telah diproses
      useEffect(() => {
        if (processedImagesCount === imageIds.length && imageIds.length > 0 && currentBatchIndex >= imageIds.length) {
            
            labeledDescriptors.forEach((val,i) => {
                let tempInitFaceLabel = facesLabels?.get(parseInt(val.label))
                tempInitFaceLabel!.descriptors = val.descriptors
                tempInitFaceLabel!.imageIds = tempInitFaceLabel?.imageIds.filter((value, index, self) =>  self.indexOf(value) === index) ?? []
                tempInitFaceLabel!.descriptors = tempInitFaceLabel?.descriptors.filter((value, index, self) =>  self.indexOf(value) === index)
                facesLabels?.set(i, tempInitFaceLabel!)
            })

            uploadAlbumResult()
        }else {
            console.log("📦masih sisah " + (imageIds.length - processedImagesCount));
        }

        async function uploadAlbumResult() {
            await uploadAlbumJson(facesLabels, albumId)
            setIsLoadingSynchronize(false)
            setAllImagesProcessed(true);
            setFacesLabels(new Map())
            setLabeledDescriptors([])
            setProcessedImagesCount(0)
        }
      }, [processedImagesCount, imageIds.length]); // Dependencies: dijalankan ulang jika `processedImagesCount` atau `imageIds.length` berubah
    


  return (
    <Button className="bg-green-600" 
        type="button"
        size="sm"
        disabled={isPublished}
        onClick={ async () => {
            setIsLoadingSynchronize(true)
            const result = await synchAlbumFiles(gdrive_id,albumId)              
            if (result == null) {
                setIsLoadingSynchronize(false)
                signOut({callbackUrl:"/login"})
                return
            }
        setAllImagesProcessed(false)
        setImageIds(result)
        console.log(result);
        console.log(imageIds.length);
        }}>
            {isLoadingSynchronize ? <span className="animate-spin material-symbols-outlined">sync</span>: "Synchronize album"}
    </Button>
  )
}
