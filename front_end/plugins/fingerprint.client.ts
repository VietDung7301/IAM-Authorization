import FingerprintJS from '@fingerprintjs/fingerprintjs'

export default defineNuxtPlugin((app) => {
    const fpPromise = FingerprintJS.load()

    return {
        provide: {
            getVisitorId: async () => {
                // Get the visitor identifier when you need it.
                    const fp = await fpPromise
                    const result = await fp.get()
                    return result.visitorId
                }
        }
    }
})