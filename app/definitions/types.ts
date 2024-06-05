
export type Albums ={
    id: string, 
    title: string,
    description: string,
    ispublished: boolean,
    user_email: string,
    gdrive_id: number | null
    links: string[] | null
}

export type FaceLabel = {
    label: number,
    descriptors: Float32Array[] | undefined,
    imageIds: string[]
}