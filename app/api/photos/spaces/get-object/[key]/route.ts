import {s3Client} from '@/app/lib/s3-client'
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3"; // ES Modules impo
import { NextResponse } from 'next/server'
import Papa from 'papaparse';


export async function GET(request: Request,{ params }: { params: { key: string } }) {
    
    
    try {
        const input = {
            "Bucket": "gdrive-ids",
            "Key": params.key,
          };
          const command = new GetObjectCommand(input);
          const response = await (await s3Client.send(command))
                    .Body?.transformToString() // transform into string for can be parse into json
    
          let result = Papa.parse(response ?? "",{delimiter: ""})

          console.log(
            "\n\n\n\n\n\n\n\ncoook"
        );
          return NextResponse.json({"result":result})
    } catch (error) {
        return NextResponse.json(error)
    }
    
}