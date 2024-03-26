const ERRORS = {
    LIMIT_OVERFLOW: 'You drive me crazy, you try to break the speed limit',
    LIMIT_TOO_LOW: 'Hay, you cannot set the limit to be less then the length',
    NOT_A_NUMBER: 'Are you mad? Limit is not a number, da!!!',
}

const addToHistory = function(data, addToEnd = true) {
    let popOrShift = 'shift'

    data.forEach((candidate) => {
        const index = this.data.findIndex((d) => d === candidate)
        if (index > -1) {
            this.data.splice(index, 1)
        }
    })

    if (addToEnd) {
        this.data.push(data)
        this.data = this.data.flat(Infinity)
        this.index = this.length
    } else {
        this.data.unshift(data)
        this.data = this.data.flat(Infinity)
        this.index = -1
        popOrShift = 'pop'
    }
    while (this.roomLeft < 0) {
        this.data[popOrShift]()
    }
    return data
}

class HistoryManager {
    constructor(limit = Number.MAX_SAFE_INTEGER) {
        this.data = []
        this.index = -1
        this.limit = limit
    }

    get length() {
        return this.data.length
    }

    get limit() {
        return this.maxLength
    }

    set limit(limit) {
        if (isNaN(parseFloat(limit)) && isFinite(limit)) {
            throw new Error(ERRORS.NOT_A_NUMBER)
        }
        if (limit < this.length) {
            throw new Error(ERRORS.LIMIT_TOO_LOW)
        }
        this.maxLength = limit
    }

    get roomLeft() {
        return this.limit - this.length
    }

    get state() {
        return {
            index: this.index,
            length: this.length,
            value: this.value,
        }
    }

    get value () {
        return this.data[this.index]
    }

    back() {
        return this.go(-1)
    }

    clear() {
        this.data = []
        this.index = -1
    }

    forward() {
        return this.go(1)
    }

    go(delta = 0) {
        this.index += delta
        this.index = Math.min(Math.max(this.index, -1), this.length)
        return this.value
    }

    push(...data) {
        return addToHistory.call(this, data)
    }

    replace(...data) {
        switch (this.index) {
            case (this.length):
                return this.push(data)
            case (-1):
                return this.unshift(data)
            default:
                this.data[this.index] = data
                this.data = this.data.flat(Infinity)
                this.index += data.length
        }
        return data
    }

    unshift(...data) {
        return addToHistory.call(this, data, false)
    }

    [Symbol.iterator]() {
        return this.data[Symbol.iterator]()
    }
}

export default HistoryManager
