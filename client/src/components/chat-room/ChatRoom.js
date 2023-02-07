import style from './chat-room.css'
import { LitElement } from 'lit-element'
import { io } from '../../../socket_io/socket.io.esm.min.js'
import { handleHistory, unHandleHistory } from '../../utils/handleHistory'
import template from './chat-room-template'

export default class ChatRoom extends LitElement {

    static styles = [style]

    static get properties() {
        return {
            inputText: {type: String, default: ''},
            name: {type: String, default: 'user'},
            roomMessages: {state: true, default: []},
            roomMetadata: {type: Object, default: { users: {} }},
            roomName: {type: String, default: 'chat'},
            type: {type: String, default: 'chat'},
            user_id: {type: String, default: `${Math.round(Math.random() * Number.MAX_SAFE_INTEGER)}`},
        }
    }

    constructor() {
        super()

        this.initProps()
    }

    async connectedCallback() {
        super.connectedCallback()

        this.icon = this.type === 'chat' ?
            await (await fetch('../../../images/user.svg')).text() :
            await (await fetch('../../../images/bot.svg')).text()

        this.inputElement = this.shadowRoot.querySelector('#text')
        this.scrollElement = this.shadowRoot.querySelector('.scroll-to-view')

        handleHistory(this.inputElement)

        this.socket = io(`http://localhost:3000`, {
            query: {
                user_id: this['user_id'],
                type: this.type,
                room: this['roomName']
            },
            extraHeaders: {
                "Access-Control-Allow-Origin": "*"
            }
        })

        this.socket.on('connect', () => {
            this.sendMessage(this['roomName'], '')
        })

        this.socket.on('message', this.onMessage)

        this.requestUpdate()
    }

    disconnectedCallback () {
        super.disconnectedCallback()
        this.socket.offAny()
        this.socket.disconnect()
        unHandleHistory(this.inputElement)
    }

    updated(_) {
        this.scrollElement?.scrollIntoView()
    }

    initProps() {
        for (const [key, prop] of Object.entries(ChatRoom.properties)) {
            this[key] = prop.default
        }
    }

    sendMessage = (roomName, text) =>
        this.socket.send({
            name: this.name,
            room: roomName,
            text: text,
            time: new Date().valueOf(),
            user_id: this['user_id'],
        })

    onMessage = ({ metadata: { users }, ...rest }) => {
        const MAX_MESSAGES = 100

        this.name = users[this['user_id']] || this.name

        if (rest.text[0])
            this.roomMessages = [...this.roomMessages, rest]
        this.roomMetadata = { users }

        if (this.roomMessages.length > MAX_MESSAGES) {
            const amount = this.roomMessages.length - MAX_MESSAGES
            this.roomMessages.splice(amount, amount)
        }
    }

    onInputChange ({ target: { value } }) {
        this.inputText = value
    }

    onInputKeyPress({ key }) {
        if ((key !== 'Enter') || (this.inputText.trim() === '')) return

        this.sendMessage(this['roomName'], this.inputText)
        this.clearInput()
    }

    onNameChange(event) {
        this.name = event.target.value
    }

    clearInput() {
        this.inputText = ''
    }

    render() {
        return template(this)
    }
}

window.customElements.define('chat-room', ChatRoom)
