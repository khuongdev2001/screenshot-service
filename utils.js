export const sleep = (delay) => {
    return new Promise(((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, delay);
    }))
} 