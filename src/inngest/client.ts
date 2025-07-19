import {Inngest} from "inngest";

export const inngest = new Inngest({id:'ai-youtube-shorts-generator',
    eventKey: process.env.INNGEST_EVENT_KEY,})