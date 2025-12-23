/**
 * Time periods for the overlay
 */
export const TIME_PERIODS = [
  { id: 'night', label: '深夜 (20:00-05:00)', hours: [20, 21, 22, 23, 0, 1, 2, 3, 4] },
  { id: 'dawn', label: '黎明 (05:00-07:00)', hours: [5, 6] },
  { id: 'morning', label: '早晨 (07:00-10:00)', hours: [7, 8, 9] },
  { id: 'day', label: '白天 (10:00-17:00)', hours: [10, 11, 12, 13, 14, 15, 16] },
  { id: 'dusk', label: '黃昏 (17:00-20:00)', hours: [17, 18, 19] }
]

/**
 * Get overlay settings based on a specific hour
 */
export function getOverlayByHour(hour) {
  // Night: 20:00 - 05:00
  if (hour >= 20 || hour < 5) {
    return {
      background: 'linear-gradient(to bottom, #0a1628 0%, #1a2a4a 50%, #2a3a5a 100%)',
      opacity: 0.7
    }
  }

  // Dawn: 05:00 - 07:00
  if (hour >= 5 && hour < 7) {
    return {
      background: 'linear-gradient(to bottom, #2a1a3a 0%, #5a3a4a 50%, #8a5a5a 100%)',
      opacity: 0.6
    }
  }

  // Morning: 07:00 - 10:00
  if (hour >= 7 && hour < 10) {
    return {
      background: 'linear-gradient(to bottom, #5a4a30 0%, #4a3a25 100%)',
      opacity: 0.7
    }
  }

  // Day: 10:00 - 17:00
  if (hour >= 10 && hour < 17) {
    return {
      background: 'rgba(0, 0, 0, 0.45)',
      opacity: 1
    }
  }

  // Dusk: 17:00 - 20:00
  if (hour >= 17 && hour < 20) {
    return {
      background: 'linear-gradient(to bottom, #6a3a28 0%, #8a4a30 30%, #2a1a3a 100%)',
      opacity: 0.6
    }
  }

  return { background: 'rgba(0, 0, 0, 0.45)', opacity: 1 }
}

/**
 * Get overlay settings based on current time of day
 * Returns background color and opacity for the overlay
 */
export function getDayNightOverlay() {
  const hour = new Date().getHours()
  return getOverlayByHour(hour)
}
