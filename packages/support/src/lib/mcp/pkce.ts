function toBase64Url(buf: Uint8Array): string {
	const binary = Array.from(buf)
		.map((b) => String.fromCharCode(b))
		.join("");
	const base64 = btoa(binary);
	return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export async function generatePKCE() {
	const randomBytes = new Uint8Array(32);
	crypto.getRandomValues(randomBytes);
	const verifier = toBase64Url(randomBytes);

	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const challenge = toBase64Url(new Uint8Array(hashBuffer));

	return { verifier, challenge };
}

export function generateState() {
	const randomBytes = new Uint8Array(32);
	crypto.getRandomValues(randomBytes);
	return toBase64Url(randomBytes);
}
