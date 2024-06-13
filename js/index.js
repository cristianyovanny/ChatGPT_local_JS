const $ = el => document.querySelector(el)
//podemos el símbolo $ para indicar que es un elemento del DOM
const $form = $('form')
const $input = $('input')
const $template = $('#message-template')
const $messages = $('ul')
const $container = $('main')
const $button = $('button')

$form.addEventListener('submit', (event) => {
    event.preventDefault()
    const messageText = $input.value.trim()

    if (messageText !== '') {
        // añadimos el mensaje al DOM
        $input.value = ''
    }

    addMessage(messageText, 'user')
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

    // actualizamos el scroll para ir bajando

    $messages.appendChild($newMessage)
    
}