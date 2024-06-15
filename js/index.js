import { CreateWebWorkerMLCEngine  } from "https://esm.run/@mlc-ai/web-llm";

const $ = el => document.querySelector(el)
//podemos el símbolo $ para indicar que es un elemento del DOM
const $form = $('form')
const $input = $('input')
const $template = $('#message-template')
const $messages = $('ul')
const $container = $('main')
const $button = $('button')
const $info = $('small')

let messages = []

if (window.Worker) { // Web Workers check
    const worker = new Worker('js/worker.js')
    worker.postMessage({name: 'Hello'}) // Send data to our worker.
    worker.onmessage = (e) => {
        console.log('Main thread: Message received from worker')
        console.log(e)
    }
}

//const SELECT_MODEL = 'Phi-3-mini-4k-instruct-q4f16_1-MLC-1k'
//const SELECT_MODEL = 'gemma-2b-it-q4f32_1-MLC'
const SELECT_MODEL = 'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC'

const engine = await CreateWebWorkerMLCEngine(
    new Worker('js/worker.js', { type: 'module'}), 
    SELECT_MODEL,
    {
        initProgressCallback: (info) => {
            //console.log('initProgressCallback', info)
            $info.textContent = `${info.text}`
            if (info.progress === 1) {
                $button.removeAttribute('disabled')
            }
        }
    }
)


$form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const messageText = $input.value.trim()

    if (messageText !== '') {
        // añadimos el mensaje al DOM
        $input.value = ''
    }

    addMessage(messageText, 'user')
    $button.setAttribute('disabled', '')

    const userMessage = {
        role: 'user',
        content: messageText
    }

    messages.push(userMessage)
    
    const chunks = await engine.chat.completions.create({
        messages,
        stream: true
    })

    let reply = ''

    const $botMessage = addMessage('', 'bot')

    for await (const chunk of chunks) {
        const [choice] = chunk.choices
        // const choice = chunk.choices[0]
        const content = choice?.delta?.content ?? ''
        reply += content
        $botMessage.textContent = reply

    }

    //console.log(reply.choices[0].message.content)
    $button.removeAttribute('disabled')
    messages.push({
        role: 'assistant',
        content: reply
    })
    $container.scrollTop = $container.scrollHeight
})

function addMessage(text, sender) {
    // clonamos el template
    const clonedTemplate = $template.content.cloneNode(true)
    const $newMessage = clonedTemplate.querySelector('.message')

    const $who = $newMessage.querySelector('span')
    const $text = $newMessage.querySelector('p')

    $text.textContent = text
    $who.textContent = sender === 'bot' ? 'GPT' : 'Tú'
    $newMessage.classList.add(sender)

    $messages.appendChild($newMessage)

    $container.scrollTop = $container.scrollHeight

    return $text
    
}