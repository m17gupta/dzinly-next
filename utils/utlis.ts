export const convertName = (name:string) => {
    const timestamp = Date.now()
    const comp = new Date(timestamp)
    const day = comp.getUTCDate()
    const month = comp.getUTCMonth()
    const year = comp.getUTCFullYear()
    const final = `${day}-${month}-${year}-${timestamp}-${name}`
    return final
}