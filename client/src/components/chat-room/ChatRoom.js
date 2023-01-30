import style from './chat-room.css'
import { LitElement, html } from 'lit'
import { io } from '../../../socket_io/socket.io.esm.min.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

export default class ChatRoom extends LitElement {

    static get properties() {
        return {
            botMessages: {state: true, default: []},
            inputText: {type: String, default: ''},
            roomMessages: {state: true, default: []},
            user_id: {type: String, default: `${Math.round(Math.random() * Number.MAX_SAFE_INTEGER)}`},
            name: {type: String, default: 'user'},
            type: {type: String, default: 'chat'},
        }
    }

    roomsMetadata = {}

    constructor() {
        super()
        this.initProps()

        this.roomsMetadata['chat'] = { users: {} }
        this.roomsMetadata[this.user_id] = { users: {} }
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

    onMessage = ({ metadata: { users }, room, ...rest }) => {
        const MAX_MESSAGES = 100

        this.name = users[this['user_id']] || this.name

        switch (room) {
            case this['user_id']:
                if (rest.text[0])
                    this.botMessages = [...this.botMessages, rest]
                this.roomsMetadata[this['user_id']] = { users }
                break
            default:
                if (rest.text[0])
                    this.roomMessages = [...this.roomMessages, rest]
                this.roomsMetadata['chat'] = { users }
        }

        if (this.roomMessages.length > MAX_MESSAGES) {
            const amount = this.roomMessages.length - MAX_MESSAGES
            this.roomMessages.splice(amount, amount)
        }
        if (this.botMessages.length > MAX_MESSAGES) {
            const amount = this.botMessages.length - MAX_MESSAGES
            this.botMessages.splice(amount, amount)
        }
        this.requestUpdate()
    }

    async connectedCallback() {
        super.connectedCallback()
        this.botSvg = await (await fetch('../../../images/bot.svg')).text()
        this.userSvg = await (await fetch('../../../images/user.svg')).text()
        this.socket = io(`http://localhost:3000?user_id=${this['user_id']}&type=${this.type}`, {
            extraHeaders: {
                "Access-Control-Allow-Origin": "*"
            }
        })
        this.socket.on('connect', () => {
            this.sendMessage('chat', '')
            this.sendMessage(this.user_id, '')
        })
        this.socket.on('message', this.onMessage)
    }

    disconnectedCallback () {
        super.disconnectedCallback()
        this.socket.offAny()
        this.socket.disconnect()
    }

    static styles = [style]

    onInputChange ({ target: { value } }) {
        this.inputText = value
    }

    onInputKeyPress({ key }) {

        if ((key !== 'Enter') || (this.inputText.trim() === '')) return

        this.sendMessage('chat', this.inputText)

        this.inputText = ''
    }

    onNameChange(event) {
        this.name = event.target.value
    }

    clearInput() {
        this.inputText = ''
    }

    render() {

        const icon = this.type === 'chat' ? this.userSvg : this.botSvg

        const { users } = this.type === 'chat' ? this.roomsMetadata['chat'] : this.roomsMetadata[this['user_id']]

        setTimeout(() => {
            this.shadowRoot.querySelector('.scroll-to-view').scrollIntoView()
        },200)
        return html`
            <div class="room-header">
                <div class="room-name">
                    <span style="float: right;">${unsafeHTML(icon)}</span>
                    ${this.type.toUpperCase()}</div>
                <label for="name">Username:
                    <input 
                        .value="${this.name}"
                        @input="${this.onNameChange}"
                        autocomplete="off"
                        id="name" />
                </label>
            </div>
            <div class="room-container">
                <div class="room-users">
                    <div class="scroller">
                        ${Object.values(users).map((data) => html`
                            <div>${data}</div>
        
                        `)}
                    </div>
                </div>
                <div class="room-messages">
                    ${this.roomMessages.map((data) => html`
                        <div>${data.name}: ${unsafeHTML(data.text + '')}</div>
                    `)}
                    <div class="scroll-to-view"></div>
                </div>
            </div>
            <div class="room-footer">
                <label for="name">Say:
                    <input
                        .value="${this.inputText}"
                        @input="${this.onInputChange}"
                        @keypress="${this.onInputKeyPress}"
                        autocomplete="off"
                        id="text" />
                </label>
                <button @click="${this.clearInput}">Clear</button>
            </div>
        `
    }
}

window.customElements.define('chat-room', ChatRoom)
