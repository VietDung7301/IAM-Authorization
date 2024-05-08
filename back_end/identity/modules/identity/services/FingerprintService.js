exports.getFingerprints = async (config) => {
    try {
        const fingerprints = await DB_CONNECTION.models.Fingerprint.findOne({where: config})
        if (fingerprints == null) {
            return false
        }
        return fingerprints.fingerprints
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.saveFingerprint = async (data) => {
    try {
        const result = await DB_CONNECTION.models.Fingerprint.upsert(data)
        return result
    } catch (error) {
        console.log(error)
        return false
    }
}