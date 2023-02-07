import { Configuration, OpenAIApi } from 'openai'
import Messaging from './Messaging.js'

class OpenAiMessaging extends Messaging {
    constructor() {
        super()
        this.config = new Configuration({
            apiKey: process.env.OPEN_AI_API_KEY,
        })
        this.openai = new OpenAIApi(this.config)
    }

    message(message) {
        super.message(message)
        if (!message.text[0]) return

        this.openai.createCompletion(
            this.createCompletion(message)
        ).then(result => {
            this.handleOpenAiReplay(result, message)
        }).catch(error => {
            console.log(error)
            this.fireEvent('error', error.message)
        })
    }

    createPrompt(text) {
        return `hilarious: ${text}`
    }

    createCompletion(message) {
        const prompt = this.createPrompt(message.text)
        return {
            frequency_penalty: 2 -  Math.random() * 4,
            max_tokens: 50,
            model: 'text-davinci-003',
            presence_penalty: 2 -  Math.random() * 4,
            prompt,
            stop: 'unrelated_text',
            temperature: Math.random(),
        }
    }

    handleOpenAiReplay(replay, message) {
        message.name = 'OpenAi'
        message.text = [this.getAnswer(replay)]
        this.fireEvent('message', message)
    }

    getAnswer(result) {
        const answer = this.cleanString(result['data'].choices[0]?.text)
        return answer || 'Confusion will be my epitaph'
    }

    cleanString(str) {
        const badStart = '?.!@#$%^*()-_'

        while (badStart.includes(str.substring(0 , 1))) {
            str = str.substring(1)
            if (!str) break
        }

        return str.replace(/\\n\\n:/, '')
            .replace(/\\n/g, '<br/>')
            .trim()
    }
}

export default OpenAiMessaging