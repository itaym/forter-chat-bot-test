import HistoryManager from '../HistoryManager'

export function handleHistory(input, name, fromLocalStorage = false) {
    input.history = {
        fromLocalStorage,
        manager: new HistoryManager(),
        name,
    }
    input.addEventListener('keydown', onKeyDown)

    if (!(name && fromLocalStorage)) return input

    const history = JSON.parse(localStorage.getItem(`${name}_history`))
    if (history) input.history.manager.push(history)

    return input
}

export function unHandleHistory(input) {
    delete input.history
    input.removeEventListener('keydown', onKeyDown)
}

function fireEvent(target) {
    let event = new Event('input', {
        bubbles: true,
        cancelable: true,
        target
    })
    target.dispatchEvent(event)
}

function onKeyDown(keyEvent) {
    const element = this
    const { fromLocalStorage, manager, name } = element.history

    switch (keyEvent.key) {
        case 'Down':
        case 'ArrowDown':
            element.value = manager.forward() || ''
            fireEvent(this)
            return true
        case 'Up':
        case 'ArrowUp':
            element.value = manager.back() || ''
            fireEvent(this)
            return true
        case 'Enter':
            if (!element.value) return true

            manager.push(element.value)

            if (name && fromLocalStorage) {
                localStorage.setItem(
                    `${name}_history`,
                    JSON.stringify([...manager])
                )
            }
            fireEvent(element)
            return true
        default:
            return true
    }
}
