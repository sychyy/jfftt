/*
 * VOICEVOX is configured on the Node.js host, not in this browser file.
 * Render environment variables:
 *   VOICEVOX_URL       = HTTPS base URL of a reachable VOICEVOX Engine
 *   VOICEVOX_FEMALE_ID = female dialogue voice style ID (default 2)
 *   VOICEVOX_MALE_ID   = male dialogue voice style ID (default 13)
 * Speaker IDs can differ by engine/version; check the engine's /speakers endpoint.
 * When unavailable, Listening falls back to browser TTS.
 */
window.JFT_VOICEVOX_FEMALE_ID = window.JFT_VOICEVOX_FEMALE_ID ?? 2;
window.JFT_VOICEVOX_MALE_ID = window.JFT_VOICEVOX_MALE_ID ?? 13;
