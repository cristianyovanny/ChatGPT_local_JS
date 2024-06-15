import { WebWorkerMLCEngineHandler, MLCEngine } from "https://esm.run/@mlc-ai/web-llm";

const engine = new MLCEngine()
const handler = new WebWorkerMLCEngineHandler(engine)

onmessage = msg => {
    handler.onmessage(msg)
}

/* onmessage = (e) => {
    console.log('Worker: Message received from main thread')
    console.log(e)
    if (e.data.name === 'Hello') {
        console.log('Worker: Sending message back to main thread')
        postMessage({name: 'Hello back'})
    }
} */