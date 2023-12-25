const b64decode = (base64String : string) => {
    return Buffer.from(base64String, 'base64').toString('hex');
  }


export default b64decode;