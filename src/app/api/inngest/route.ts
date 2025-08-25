import {serve} from 'inngest/next'
import {inngest} from '../../../inngest/client'
import { GenerateVideoData, GenerateVideo} from '@/inngest/function'

export const {GET, POST,PUT} = serve({
    client: inngest,
    functions: [
        GenerateVideoData,
        GenerateVideo
    ]
})