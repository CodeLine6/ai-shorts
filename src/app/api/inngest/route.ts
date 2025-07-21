import {serve} from 'inngest/next'
import {inngest} from '../../../inngest/client'
import { GenerateVideoData, helloWorld,HandleRemotionRenderWebhook } from '@/inngest/function'

export const {GET, POST,PUT} = serve({
    client: inngest,
    functions: [
        helloWorld,
        GenerateVideoData,
        HandleRemotionRenderWebhook
    ]
})