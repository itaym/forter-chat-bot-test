const fs = require('fs');
const path = require('path');

function promisify(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            const myCallback = (err, data) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            }
            fn.apply(null, [...args, myCallback])
        })
    }
}

const promisedReadFile = promisify(fs.readFile);
const myFile = `${__dirname}/index.js`

async function init() {
    try {
        const data = await promisedReadFile(path.join(myFile), 'utf-8')
        console.log(data)
    }
    catch (e) {
        console.log(e)
    }
}

fs.readFile(path.join(myFile), 'utf-8', (err, data) => {
    if (!err) {
        console.log(data)
        return
    }
    console.log(err)
})

init().then()