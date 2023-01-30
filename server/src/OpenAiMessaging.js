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
            this.fireEvent('error', error.message)
        })
    }

    createPrompt(text) {
        return `funny: ${text}`
    }

    createCompletion(message) {
        const prompt = this.createPrompt(message.text)
        return {
            max_tokens: 50,
            model: 'text-davinci-003',
            prompt,
            stop: 'unrelated_text',
            temperature: 0.3,
        }
    }

    handleOpenAiReplay(replay, message) {
        const answer = this.getAnswer(replay)
        message.name = 'OpenAi'
        message.text = [this.cleanString(answer)]
        this.fireEvent('message', message)
    }

    getAnswer(result) {
        return result['data'].choices[0]?.text || 'Confusion will be my epitaph'
    }

    cleanString(str) {
        const badStart = '?.!@#$%^*()-_'
        if (!str) return str
        while (badStart.includes(str.substring(0 , 1))) {
            str = str.substring(1)
        }

        return str.replace(/\\n\\n:/, '')
            .replace(/\\n/g, '<br/>')
            .trim()
    }
}

export default OpenAiMessaging