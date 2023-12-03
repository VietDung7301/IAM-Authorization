function generateCode(length, isOID = false) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  if (isOID)
    result = result + '@oid'
  else
    result = result + '@noid'

  return result;
}

module.exports = { generateCode }