export async function generateKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256"
    },
    true,
    ["sign", "verify"]
  )
}

export async function exportPublicKey(key: CryptoKey) {
  const spki = await crypto.subtle.exportKey("spki", key)
  return btoa(String.fromCharCode(...new Uint8Array(spki)))
}

export async function sha256(data: string) {
  const encoded = new TextEncoder().encode(data)
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function signHash(
  privateKey: CryptoKey,
  hashHex: string
) {
  const bytes = new Uint8Array(
    hashHex.match(/.{1,2}/g)!.map(b => parseInt(b, 16))
  )

  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    bytes
  )

  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}
