import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import style from './site-header.css.js'

export default class SiteHeader extends LitElement {

    constructor() {
        super()
        this.logoSvg = ''
    }

    static styles = [style]

    async connectedCallback() {
        super.connectedCallback()
        this.logoSvg = await (await fetch('../../../images/logo.svg')).text()
        this.requestUpdate()
    }

    render() {
        return html`
            ${unsafeHTML(this.logoSvg)}
            <div class="text-holder">
                <div class="text">Itay Merchav</div>
            </div>    
    `
    }
}

window.customElements.define('site-header', SiteHeader)
