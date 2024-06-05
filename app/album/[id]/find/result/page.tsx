"use client";

import { redirect } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import useSWR from "swr";
import * as faceapi from "face-api.js";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function Page({ params }: { params: { id: string } }) {
  const reference = JSON.parse(localStorage.getItem("referenceObject")!);

  if (reference == null) {
    redirect(`/album/${params.id}`);
  }

  const isFirstRender = useRef(true);
  const isReadyToImportModel = useRef(false);
  const [isProcess, setIsProcess] = useState(false);
  const [imagesOfMatch, setImagesOfMatch] = useState<string[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);

  // fetch images data in database
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    `/api/photos/spaces/get-object/${params.id}`,
    fetcher
  );

  useEffect(() => {
    // Prevent the function from executing on the first render

    if (!isFirstRender) {
      isReadyToImportModel.current = false; // toggle flag after first render/mounting
      useRouter().reload();
      return;
    }

    (async () => {
      // loading the models

      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      //   await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
        <p className="text-xl font-semibold"> Loading... </p>
        <p className="text-lg font-normal"> preparing album images data </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
        <p className="text-lg font-normal"> Something wrong 🥲 </p>
      </div>
    );
  }

  async function detect() {
    setIsProcess(true);
    const referenceMatcher = new faceapi.FaceMatcher(
      new Float32Array(reference.descriptors[0])
    );
    let indexOfMatches: number[] = [];
    const labeledDescriptors: faceapi.LabeledFaceDescriptors[] = [];
    for (const labelItem of data) {
      labeledDescriptors.push(
        new faceapi.LabeledFaceDescriptors(
          labelItem.label.toString(),
          labelItem.descriptors.map(
            (desc: Iterable<number>) => new Float32Array(desc)
          )
        )
      );
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
    const bestMatch = faceMatcher.findBestMatch(
      new Float32Array(reference.descriptors[0])
    );
    if (bestMatch.label != "unknown") {
      setImagesOfMatch([...data[parseInt(bestMatch.label)].imageIds]);
    }else {
        setIsNotFound(true)
    }
    setIsProcess(false);
  }

  return (
    <div className="w-screen flex flex-col gap-2 items-center justify-center py-6 px-2">
      <p className="font-bold text-xl mb-9 text-center">
        Discover all your saved photos <br /> here 🔍
      </p>
      <div className="w-full flex flex-col gap-2 items-center justify-center">
        <Button
          className=" md:w-19"
          onClick={async () => {
            detect();
          }}
        >
          Start find my Photos
        </Button>
        <p className="font-medium text-normal ">
          Collection total : {data.length} images
        </p>
      </div>
      {isProcess && <p className="w-full h-full text-center">🔍 Processing to find your images 🔍</p>}
      {isNotFound && <div className="w-full h-full flex flex-col gap-1 items-center justify-center"><p className="text-lg font-medium">Sorry we cant find your photos</p>
          <p>contact the provider to update the album</p>
       </div>
       }
      {data.length > 0 && imagesOfMatch.length > 0 && (
        <div className="w-screen h-screen flex flex-row gap-2 flex-wrap  px-9 justify-center mt-3 ">
          {data.length > 0 &&
            imagesOfMatch.length > 0 &&
            imagesOfMatch.map((item) => {
              return (
                <div className="" key={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle></CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        className="w-72 h-fit aspect-square rounded-md object-cover"
                        id={`images-result-${item}`}
                        src={`/api/photos/forward-image/${item}`}
                        alt=""
                      />
                    </CardContent>
                    <CardFooter>
                      <a
                        href={`https://drive.usercontent.google.com/download?id=${item}&export=download&authuser=1`}
                      >
                        <Button>Download</Button>
                      </a>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
