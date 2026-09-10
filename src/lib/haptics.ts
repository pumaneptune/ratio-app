// Web equivalent of expo-haptics — uses the Vibration API where available.
// On unsupported browsers these are silent no-ops.

export function hapticLight(): void {
  try {
    navigator.vibrate?.(8);
  } catch {
    // vibration not supported — silent no-op
  }
}

export function hapticSuccess(): void {
  try {
    navigator.vibrate?.([8, 30, 14]);
  } catch {
    // vibration not supported — silent no-op
  }
}
