/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */

// Starting location: Kyrene Rd & De La Mariposa Dr, Ahwatukee, Phoenix, AZ
export const STARTING_LOCATION = {
  lat: 33.3003,
  lng: -111.9825,
  address: "Kyrene Rd & De La Mariposa Dr, Phoenix, AZ 85044"
};

/**
 * Haversine formula to calculate distance between two points on Earth
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in miles
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Geocode an address using OpenStreetMap Nominatim API (free, no API key required)
 * Returns coordinates or null if geocoding fails
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Use OpenStreetMap Nominatim API (free, no API key needed)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'PartyLabAZ-Booking/1.0' // Required by Nominatim usage policy
        }
      }
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Calculate distance from starting location to a given address
 * @param address Customer's event address
 * @returns Distance in miles, or null if geocoding fails
 */
export async function calculateDistanceFromBase(address: string): Promise<number | null> {
  const coordinates = await geocodeAddress(address);

  if (!coordinates) {
    return null;
  }

  const distance = haversineDistance(
    STARTING_LOCATION.lat,
    STARTING_LOCATION.lng,
    coordinates.lat,
    coordinates.lng
  );

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate trip charge based on distance
 * @param distance Distance in miles
 * @returns Trip charge amount ($50 if >25 miles, $0 otherwise)
 */
export function calculateTripCharge(distance: number): number {
  return distance > 25 ? 50 : 0;
}
