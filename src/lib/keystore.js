import pbkdf2 from 'pbkdf2'
import aesjs from 'aes-js'
import { isAddressValid, pkToAddress } from '@tronscan/client/src/utils/crypto'
import { byteArray2hexStr, bytesToString } from '@tronscan/client/src/utils/bytes'
import { stringToBytes, hexStr2byteArray } from '@tronscan/client/src/lib/code'

const uuidv4 = require('uuid/v4')

export function encryptKey(password, salt) {
    return pbkdf2.pbkdf2Sync(password, salt, 1, 256 / 8, 'sha512')
}

export function encryptString(password, hexString) {
    const textBytes = aesjs.utils.utf8.toBytes(hexString)
    const aesCtr = new aesjs.ModeOfOperation.ctr(password)
    const encrypted = aesCtr.encrypt(textBytes)

    return {
        bytes: encrypted,
        hex: aesjs.utils.hex.fromBytes(encrypted),
    }
}

export function decryptString(password, salt, hexString) {
    const key = encryptKey(password, salt)
    const encryptedBytes = aesjs.utils.hex.toBytes(hexString)
    const aesCtr = new aesjs.ModeOfOperation.ctr(key)
    const decryptedBytes = aesCtr.decrypt(encryptedBytes)

    return aesjs.utils.utf8.fromBytes(decryptedBytes)
}

export function validatePrivateKey(privateKey) {
    try {
        const address = pkToAddress(privateKey)
        return isAddressValid(address)
    } catch (e) {
        return false
    }
}

export function encryptKeyStore(password, privateKey, address) {
    const salt = uuidv4()
    const encryptedKey = encryptKey(password, salt)
    const { hex } = encryptString(encryptedKey, privateKey)

    const data = {
        version: 1,
        key: hex,
        address: address,
        salt,
    }

    return byteArray2hexStr(stringToBytes(JSON.stringify(data)))
}

export function decryptKeyStore(password, keystore) {
    if (!password) {
        return false
    }

    const { key, address, salt } = JSON.parse(bytesToString(hexStr2byteArray(keystore)))
    const privateKey = decryptString(password, salt, key)

    if (validatePrivateKey(privateKey) && pkToAddress(privateKey) === address) {
        return {
            address,
            privateKey
        }
    }

    return false
}
