import { html } from 'lit-element'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

const template = function(_this) {
    return (
        function () {
            const { users } = this.roomMetadata
            return html`
                <div class="room-header">
                    <div class="room-name">
                        <span style="float: right;">${unsafeHTML(this.icon)}</span>
                        ${this['roomName']}
                    </div>
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
            `}
    ).call(_this)
}

export default template