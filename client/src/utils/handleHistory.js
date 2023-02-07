import HistoryManager from '../HistoryManager'

export function handleHistory(input) {
    input.historyManager = new HistoryManager()
    input.addEventListener('keydown', onKeyDown)
}

export function unHandleHistory(input) {
    delete input.historyManager
    input.removeEventListener('keydown', onKeyDown)
}

function fireEvent(element) {
    let event = new Event('input', {
        bubbles: true,
        cancelable: true,
    })
    element.dispatchEvent(event)
}

function onKeyDown(keyEvent) {
    const element = this

    switch (keyEvent.key) {
        case 'Down':
        case 'ArrowDown':
            element.value = element.historyManager.forward() || ''
            fireEvent(this)
            return
        case 'Up':
        case 'ArrowUp':
            element.value = element.historyManager.back() || ''
            fireEvent(this)
            return
        case 'Enter':
            if (!element.value) return
            element.historyManager.push(element.value)
            fireEvent(element)
            return
        default:
            return
    }
}
