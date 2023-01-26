class Messaging {

    constructor() {
        this.callEvent = {}
        this.callEvent.error = () => {}
        this.callEvent.message = () => {}
    }
    fireEvent(eventName, data) {
        this.callEvent[eventName](data)
    }
    on(eventName, handler) {
        this.callEvent[eventName] = handler
    }
    off(eventName) {
        this.callEvent[eventName] = () => {}
    }
    message(message) {
        message.text = [message.text].flat()
        this.fireEvent('message', message)
    }
}

export default Messaging