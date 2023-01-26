import { Configuration, OpenAIApi } from 'openai'
import Messaging from './Messaging.js'

function selectRandomModel() {
    const models = ['text-davinci-002', 'text-curie-001']
    const randomIndex = Math.floor(Math.random() * models.length);
    return models[randomIndex];
}

function cleanString(str) {
    const badStart = '?.!@#$%^*()'
    if (badStart.includes(str.substring(0 , 1))) str = str.substring(1)

    return str.replace(/nasty\:/g, '').
        replace(/Nasty\:/g, '').
        replace(/Nasty/g, '').
        replace(/\n/g, '').trim()
}
class OpenAiMessaging extends Messaging {

    constructor() {
        super();

        const configuration = new Configuration({

            //I didn't have time to implement dot-env
            apiKey: "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",
        })
        this.openai = new OpenAIApi(configuration);
    }
    message(message) {
        super.message(message)
        if (!message.text[0]) return

        this.openai.createCompletion({
            model: selectRandomModel(),
            prompt: `nasty:${message.text}`,
            max_tokens: 40,
            temperature: 0.4,
        }).then(result => {

            let answer = result['data'].choices[0] ? result['data'].choices[0].text : 'Confusion will be my epitaph'
            message.name = 'OpenAi'
            message.text = [cleanString(answer)]
            this.fireEvent('message', message)
        }).catch(error => {
            this.fireEvent('error', error.message)
        })
    }
}

export default OpenAiMessaging