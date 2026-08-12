const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================================
   HOME
========================================================= */

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Sahaay API is running"
  });
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Sahaay server is healthy"
  });
});

/* =========================================================
   SERVICE TYPES
========================================================= */

const serviceTypes = {
  hospital: [
    '["amenity"="hospital"]',
    '["healthcare"="hospital"]',
    '["amenity"="clinic"]'
  ],

  hospitals: [
    '["amenity"="hospital"]',
    '["healthcare"="hospital"]',
    '["amenity"="clinic"]'
  ],

  school: [
    '["amenity"="school"]'
  ],

  schools: [
    '["amenity"="school"]'
  ],

  college: [
    '["amenity"="college"]'
  ],

  colleges: [
    '["amenity"="college"]'
  ],

  university: [
    '["amenity"="university"]'
  ],

  universities: [
    '["amenity"="university"]'
  ],

  pharmacy: [
    '["amenity"="pharmacy"]'
  ],

  pharmacies: [
    '["amenity"="pharmacy"]'
  ],

  police: [
    '["amenity"="police"]'
  ],

  'police station': [
    '["amenity"="police"]'
  ],

  'blood bank': [
    '["amenity"="blood_bank"]'
  ],

  bloodbank: [
    '["amenity"="blood_bank"]'
  ],

  library: [
    '["amenity"="library"]'
  ],

  libraries: [
    '["amenity"="library"]'
  ],

  'scholarship centre': [
    '["office"="educational_institution"]',
    '["amenity"="college"]',
    '["amenity"="university"]'
  ],

  'scholarship center': [
    '["office"="educational_institution"]',
    '["amenity"="college"]',
    '["amenity"="university"]'
  ],

  scholarship: [
    '["office"="educational_institution"]',
    '["amenity"="college"]',
    '["amenity"="university"]'
  ],

  bank: [
    '["amenity"="bank"]'
  ],

  banks: [
    '["amenity"="bank"]'
  ],

  atm: [
    '["amenity"="atm"]'
  ],

  'bus station': [
    '["amenity"="bus_station"]'
  ],

  'railway station': [
    '["railway"="station"]'
  ],

  railway: [
    '["railway"="station"]'
  ],

  'fire station': [
    '["amenity"="fire_station"]'
  ],

  hotel: [
    '["tourism"="hotel"]'
  ],

  hotels: [
    '["tourism"="hotel"]'
  ]
};

/* =========================================================
   FIND SERVICE TYPE
========================================================= */

function findServiceType(problem) {
  const input = problem
    .toLowerCase()
    .trim();

  const keys = Object.keys(serviceTypes);

  // Exact match first
  if (serviceTypes[input]) {
    return input;
  }

  // Partial match
  for (const key of keys) {
    if (
      input.includes(key) ||
      key.includes(input)
    ) {
      return key;
    }
  }

  return null;
}

/* =========================================================
   BUILD OVERPASS QUERY
========================================================= */

function buildOverpassQuery(
  tags,
  latitude,
  longitude,
  radius
) {
  const statements = tags
    .map(
      (tag) => `
        node${tag}(around:${radius},${latitude},${longitude});
        way${tag}(around:${radius},${latitude},${longitude});
        relation${tag}(around:${radius},${latitude},${longitude});
      `
    )
    .join("\n");

  return `
    [out:json][timeout:30];

    (
      ${statements}
    );

    out center tags;
  `;
}

/* =========================================================
   ANALYZE / NEARBY SEARCH
========================================================= */

app.post("/api/analyze", async (req, res) => {
  try {
    const {
      problem,
      location,
      language
    } = req.body;

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!problem || !location || !language) {
      return res.status(400).json({
        status: "error",
        message:
          "Problem, location and language are required"
      });
    }

    const searchLocation = location.trim();

    /* -----------------------------------------------------
       DETERMINE SERVICE
    ----------------------------------------------------- */

    const serviceType =
      findServiceType(problem);

    if (!serviceType) {
      return res.json({
        status: "success",
        type: "unknown",
        results: [],
        message:
          `Sahaay could not identify the service "${problem}". Try searching for a hospital, school, college, scholarship centre, police station, pharmacy, bank, ATM, blood bank or another nearby service.`
      });
    }

    /* -----------------------------------------------------
       GEOCODING
       Convert Chennai / Kanchipuram etc. into coordinates
    ----------------------------------------------------- */

    const geocodeUrl =
      `https://nominatim.openstreetmap.org/search` +
      `?q=${encodeURIComponent(searchLocation)}` +
      `&format=json` +
      `&limit=1`;

    const geocodeResponse =
      await fetch(geocodeUrl, {
        headers: {
          "User-Agent":
            "Sahaay-Community-Service-Finder/1.0"
        }
      });

    if (!geocodeResponse.ok) {
      throw new Error(
        "Location service is unavailable"
      );
    }

    const geocodeData =
      await geocodeResponse.json();

    if (
      !geocodeData ||
      geocodeData.length === 0
    ) {
      return res.status(404).json({
        status: "error",
        message:
          `Location "${searchLocation}" could not be found.`
      });
    }

    const latitude =
      parseFloat(geocodeData[0].lat);

    const longitude =
      parseFloat(geocodeData[0].lon);

    /* -----------------------------------------------------
       SEARCH RADIUS
       10 KM
    ----------------------------------------------------- */

    const radius = 10000;

    const tags =
      serviceTypes[serviceType];

    const overpassQuery =
      buildOverpassQuery(
        tags,
        latitude,
        longitude,
        radius
      );

    /* -----------------------------------------------------
       SEARCH OPENSTREETMAP
    ----------------------------------------------------- */

    const overpassResponse =
      await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain",
            "User-Agent":
              "Sahaay-Community-Service-Finder/1.0"
          },

          body: overpassQuery
        }
      );

    if (!overpassResponse.ok) {
      throw new Error(
        "Nearby service search failed"
      );
    }

    const overpassData =
      await overpassResponse.json();

    /* -----------------------------------------------------
       CONVERT RESULTS
    ----------------------------------------------------- */

    const results =
      (overpassData.elements || [])
        .map((place) => {
          const tags =
            place.tags || {};

          const placeLatitude =
            place.lat ??
            place.center?.lat ??
            null;

          const placeLongitude =
            place.lon ??
            place.center?.lon ??
            null;

          const addressParts = [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:suburb"],
            tags["addr:city"],
            tags["addr:postcode"]
          ].filter(Boolean);

          const address =
            tags["addr:full"] ||
            addressParts.join(", ") ||
            tags["addr:place"] ||
            "Address not available";

          const phone =
            tags.phone ||
            tags["contact:phone"] ||
            tags["contact:mobile"] ||
            "Phone number not available";

          const website =
            tags.website ||
            tags["contact:website"] ||
            "";

          let mapUrl = "";

          if (
            placeLatitude !== null &&
            placeLongitude !== null
          ) {
            mapUrl =
              `https://www.google.com/maps/search/?api=1&query=${placeLatitude},${placeLongitude}`;
          } else {
            mapUrl =
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                (tags.name || serviceType) +
                " " +
                searchLocation
              )}`;
          }

          return {
            id: place.id,

            name:
              tags.name ||
              `${serviceType
                .charAt(0)
                .toUpperCase() +
                serviceType.slice(1)}`,

            address,

            phone,

            website,

            latitude:
              placeLatitude,

            longitude:
              placeLongitude,

            mapUrl,

            openingHours:
              tags.opening_hours ||
              "Opening hours not available",

            emergency:
              tags.emergency ||
              "Not specified"
          };
        });

    /* -----------------------------------------------------
       REMOVE DUPLICATES
    ----------------------------------------------------- */

    const uniqueResults = [];

    const seenNames =
      new Set();

    for (const place of results) {
      const name =
        place.name
          .toLowerCase()
          .trim();

      if (!seenNames.has(name)) {
        seenNames.add(name);
        uniqueResults.push(place);
      }
    }

    /* -----------------------------------------------------
       LIMIT RESULTS
    ----------------------------------------------------- */

    const finalResults =
      uniqueResults.slice(0, 20);

    /* -----------------------------------------------------
       NO RESULTS
    ----------------------------------------------------- */

    if (finalResults.length === 0) {
      return res.json({
        status: "success",

        type: serviceType,

        location: searchLocation,

        language,

        count: 0,

        results: [],

        message:
          `No nearby ${serviceType} locations were found within 10 km of ${searchLocation}.`
      });
    }

    /* -----------------------------------------------------
       SUCCESS
    ----------------------------------------------------- */

    return res.json({
      status: "success",

      type: serviceType,

      location: searchLocation,

      language,

      count: finalResults.length,

      results: finalResults,

      message:
        `Found ${finalResults.length} nearby ${serviceType} location(s) near ${searchLocation}.`
    });

  } catch (error) {
    console.error(
      "Sahaay Search Error:",
      error
    );

    return res.status(500).json({
      status: "error",

      message:
        "Unable to find nearby services right now.",

      error:
        error.message
    });
  }
});

/* =========================================================
   404
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "API endpoint not found"
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT =
  process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Sahaay server running on port ${PORT}`
  );
});