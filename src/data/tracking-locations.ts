export interface TrackingLocation {
  city: string
  country: string
  coordinates: [number, number] // [longitude, latitude]
  users: number
  color: 'primary' | 'accent'
}

export const trackingLocations: TrackingLocation[] = [
  { city: 'Sofia', country: 'Bulgaria', coordinates: [23.3219, 42.6977], users: 12, color: 'primary' },
  { city: 'Plovdiv', country: 'Bulgaria', coordinates: [24.7453, 42.1354], users: 5, color: 'primary' },
  { city: 'Varna', country: 'Bulgaria', coordinates: [27.9147, 43.2141], users: 3, color: 'accent' },
  { city: 'London', country: 'United Kingdom', coordinates: [-0.1276, 51.5074], users: 4, color: 'accent' },
  { city: 'Berlin', country: 'Germany', coordinates: [13.4050, 52.5200], users: 3, color: 'primary' },
  { city: 'Amsterdam', country: 'Netherlands', coordinates: [4.9041, 52.3676], users: 2, color: 'accent' },
  { city: 'New York', country: 'United States', coordinates: [-74.006, 40.7128], users: 3, color: 'primary' },
  { city: 'Dubai', country: 'UAE', coordinates: [55.2708, 25.2048], users: 2, color: 'accent' },
  { city: 'Bucharest', country: 'Romania', coordinates: [26.1025, 44.4268], users: 2, color: 'primary' },
  { city: 'Istanbul', country: 'Turkey', coordinates: [28.9784, 41.0082], users: 1, color: 'accent' },
]

export const totalUsers = trackingLocations.reduce((sum, loc) => sum + loc.users, 0)
export const totalCountries = new Set(trackingLocations.map(l => l.country)).size
export const totalCities = trackingLocations.length
export const uptimePercent = 99.97

export function planBreakdown(total: number) {
  const exclusive = Math.max(1, Math.round(total * 0.05))
  const pro = Math.max(1, Math.round(total * 0.22))
  const free = total - pro - exclusive
  return { free, pro, exclusive }
}
