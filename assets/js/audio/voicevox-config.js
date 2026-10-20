/*
 * Optional deterministic Japanese TTS configuration.
 * Host a VOICEVOX Engine separately over HTTPS, then enter its base URL below.
 * Example shape: https://your-voicevox-host.example (no trailing slash).
 * Keep blank to use Japanese voices supplied by the user's browser/device.
 */
window.JFT_VOICEVOX_ENDPOINT = window.JFT_VOICEVOX_ENDPOINT || '';
window.JFT_VOICEVOX_FEMALE_ID = window.JFT_VOICEVOX_FEMALE_ID ?? 2;
window.JFT_VOICEVOX_MALE_ID = window.JFT_VOICEVOX_MALE_ID ?? 13;
