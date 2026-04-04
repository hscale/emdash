/**
 * Passkey configuration helper
 *
 * Extracts passkey configuration from the request URL.
 * This ensures the rpId and origin are correctly set for both
 * localhost development and production deployments.
 */

export interface PasskeyConfig {
	rpName: string;
	rpId: string;
	origin: string;
}

/**
 * Get passkey configuration from request URL
 *
 * Behind a reverse proxy (Cloudflare, nginx), `request.url` resolves to the
 * internal host (e.g. localhost:4000). Use `X-Forwarded-Host` and
 * `X-Forwarded-Proto` when present so the RP ID and origin match the
 * public domain the browser sees.
 *
 * @param url The request URL
 * @param siteName Optional site name for rpName (defaults to hostname)
 * @param request Optional Request to read forwarded headers from
 */
export function getPasskeyConfig(
	url: URL,
	siteName?: string,
	request?: Request,
): PasskeyConfig {
	let hostname = url.hostname;
	let origin = url.origin;

	if (request) {
		const fwdHost = request.headers.get("x-forwarded-host");
		const fwdProto = request.headers.get("x-forwarded-proto");
		if (fwdHost) {
			hostname = fwdHost.split(",")[0].trim();
			const proto = fwdProto?.split(",")[0].trim() || url.protocol.replace(":", "");
			origin = `${proto}://${hostname}`;
		}
	}

	return {
		rpName: siteName || hostname,
		rpId: hostname,
		origin,
	};
}
