const express = require("express");
const cors = require("cors");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Sahaay API is running"
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Sahaay server is healthy"
  });
});

// =====================================================
// SERVICE TYPES
// =====================================================

const serviceTypes = {

  // ---------------- HEALTHCARE ----------------

  hospital: [
    '["amenity"="hospital"]',
    '["healthcare"="hospital"]'
  ],

  hospitals: [
    '["amenity"="hospital"]',
    '["healthcare"="hospital"]'
  ],

  clinic: [
    '["amenity"="clinic"]',
    '["healthcare"="clinic"]'
  ],

  clinics: [
    '["amenity"="clinic"]',
    '["healthcare"="clinic"]'
  ],

  pharmacy: [
    '["amenity"="pharmacy"]'
  ],

  pharmacies: [
    '["amenity"="pharmacy"]'
  ],

  // ---------------- EDUCATION ----------------

  school: [
    '["amenity"="school"]'
  ],

  schools: [
    '["amenity"="school"]'
  ],

  education: [
    '["amenity"="school"]',
    '["amenity"="college"]',
    '["amenity"="university"]'
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

  // ---------------- SCHOLARSHIPS ----------------

  scholarship: [
    '["office"="educational_institution"]',
    '["amenity"="college"]',
    '["amenity"="university"]'
  ],

  scholarships: [
    '["office"="educational_institution"]',
    '["amenity"="college"]',
    '["amenity"="university"]'
  ],

  "scholarship centre": [
    '["office"="educational_institution"]',
    '["amenity"="college"]',
    '["amenity"="university"]'
  ],

  "scholarship center": [
    '["office"="educational_institution"]',
    '["amenity"="college"]',
    '["amenity"="university"]'
  ],

  // ---------------- POLICE ----------------

  police: [
    '["amenity"="police"]'
  ],

  "police station": [
    '["amenity"="police"]'
  ],

  // ---------------- BANK ----------------

  bank: [
    '["amenity"="bank"]'
  ],

  banks: [
    '["amenity"="bank"]'
  ],

  // ---------------- ATM ----------------

  atm: [
    '["amenity"="atm"]'
  ],

  // ---------------- LIBRARY ----------------

  library: [
    '["amenity"="library"]'
  ],

  libraries: [
    '["amenity"="library"]'
  ],

  // ---------------- BLOOD BANK ----------------

  "blood bank": [
    '["amenity"="blood_bank"]'
  ],

  bloodbank: [
    '["amenity"="blood_bank"]'
  ]
};

// =====================================================
// FIND SERVICE TYPE
// =====================================================

function findServiceType(problem) {

  const input = String(problem || "")
    .toLowerCase()
    .trim();

  // Exact match
  if (serviceTypes[input]) {
    return input;
  }

  // Hospital
  if (input.includes("hospital")) {
    return "hospital";
  }

  // Clinic
  if (input.includes("clinic")) {
    return "clinic";
  }

  // Pharmacy
  if (
    input.includes("pharmacy") ||
    input.includes("pharmacies")
  ) {
    return "pharmacy";
  }

  // School
  if (input.includes("school")) {
    return "school";
  }

  // Education
  if (
    input.includes("education") ||
    input.includes("educational")
  ) {
    return "education";
  }

  // Scholarship
  if (input.includes("scholarship")) {
    return "scholarship";
  }

  // College
  if (input.includes("college")) {
    return "college";
  }

  // University
  if (input.includes("university")) {
    return "university";
  }

  // Police
  if (input.includes("police")) {
    return "police";
  }

  // Blood bank
  if (
    input.includes("blood bank") ||
    input.includes("bloodbank") ||
    input.includes("blood")
  ) {
    return "blood bank";
  }

  // Bank
  if (
    input.includes("bank") &&
    !input.includes("blood")
  ) {
    return "bank";
  }

  // Library
  if (input.includes("library")) {
    return "library";
  }

  // ATM
  if (input.includes("atm")) {
    return "atm";
  }

  return null;
}

// =====================================================
// BUILD OVERPASS QUERY
// =====================================================

function buildOverpassQuery(
  tags,
  latitude,
  longitude,
  radius
) {

  const statements = tags
    .map((tag) => {

      return `
        node${tag}(around:${radius},${latitude},${longitude});
        way${tag}(around:${radius},${latitude},${longitude});
        relation${tag}(around:${radius},${latitude},${longitude});
      `;

    })
    .join("\n");

  return `
    [out:json][timeout:20];

    (
      ${statements}
    );

    out center tags;
  `;
}

// =====================================================
// GET GEOCORDINATES
// =====================================================

async function getCoordinates(location) {

  const url =
    "https://nominatim.openstreetmap.org/search" +
    "?q=" +
    encodeURIComponent(location) +
    "&format=json" +
    "&limit=1";

  const response = await fetch(
    url,
    {
      headers: {
        "User-Agent":
          "Sahaay-Community-Service-Finder/1.0"
      },

      signal: AbortSignal.timeout(10000)
    }
  );

  if (!response.ok) {
    throw new Error(
      `Location service returned HTTP ${response.status}`
    );
  }

  const data = await response.json();

  if (
    !Array.isArray(data) ||
    data.length === 0
  ) {
    return null;
  }

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon)
  };
}

// =====================================================
// SEARCH OVERPASS SERVERS
// =====================================================

async function searchOverpass(
  query
) {

  const servers = [

    "https://overpass-api.de/api/interpreter",

    "https://overpass.private.coffee/api/interpreter",

    "https://overpass.kumi.systems/api/interpreter"

  ];

  for (const server of servers) {

    try {

      console.log(
        "Trying Overpass:",
        server
      );

      const response = await fetch(
        server,
        {
          method: "POST",

          headers: {
            "Content-Type": "text/plain",
            "User-Agent":
              "Sahaay-Community-Service-Finder/1.0"
          },

          body: query,

          signal:
            AbortSignal.timeout(12000)
        }
      );

      console.log(
        "Overpass status:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data =
        await response.json();

      if (
        data &&
        Array.isArray(data.elements)
      ) {

        console.log(
          "Overpass returned:",
          data.elements.length,
          "elements"
        );

        return data;
      }

    }
    catch (error) {

      console.error(
        "Overpass failed:",
        server
      );

      console.error(
        error.message
      );

    }
  }

  return null;
}

// =====================================================
// CREATE ADDRESS
// =====================================================

function createAddress(tags) {

  const addressParts = [

    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:district"],
    tags["addr:postcode"]

  ].filter(Boolean);

  return (
    tags["addr:full"] ||
    addressParts.join(", ") ||
    tags["addr:place"] ||
    tags["addr:street"] ||
    "Address not available"
  );
}

// =====================================================
// CREATE RESOURCE
// =====================================================

function createResource(
  place,
  serviceType,
  searchLocation
) {

  const tags =
    place.tags || {};

  const latitude =
    place.lat ??
    place.center?.lat ??
    null;

  const longitude =
    place.lon ??
    place.center?.lon ??
    null;

  const address =
    createAddress(tags);

  const phone =
    tags.phone ||
    tags["contact:phone"] ||
    tags["contact:mobile"] ||
    tags["contact:telephone"] ||
    "Phone number not available";

  const website =
    tags.website ||
    tags["contact:website"] ||
    "";

  const email =
    tags.email ||
    tags["contact:email"] ||
    "";

  const openingHours =
    tags.opening_hours ||
    "Opening hours not available";

  const name =
    tags.name ||
    `${serviceType
      .charAt(0)
      .toUpperCase()}${serviceType.slice(1)}`;

  let mapUrl = "";

  if (
    latitude !== null &&
    longitude !== null
  ) {

    mapUrl =
      "https://www.google.com/maps/search/?api=1&query=" +
      `${latitude},${longitude}`;

  }
  else {

    mapUrl =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        `${name} ${searchLocation}`
      );

  }

  return {

    id:
      `${place.type || "place"}-${place.id}`,

    title:
      name,

    name:
      name,

    category:
      serviceType,

    type:
      serviceType,

    description:
      `Nearby ${serviceType} resource located in ${searchLocation}.`,

    location:
      address,

    address:
      address,

    phone:
      phone,

    website:
      website,

    email:
      email,

    latitude:
      latitude,

    longitude:
      longitude,

    mapUrl:
      mapUrl,

    availability:
      openingHours,

    openingHours:
      openingHours,

    emergency:
      tags.emergency ||
      "Not specified",

    cost:
      "Contact provider",

    source:
      "OpenStreetMap",

    lastUpdated:
      new Date().toLocaleDateString("en-IN")

  };
}

// =====================================================
// REMOVE DUPLICATES
// =====================================================

function removeDuplicates(results) {

  const seen = new Set();

  return results.filter(
    (resource) => {

      const key =
        resource.name
          .toLowerCase()
          .trim();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    }
  );
}

// =====================================================
// ANALYZE / FIND RESOURCES
// =====================================================

app.post(
  "/api/analyze",
  async (req, res) => {

    try {

      console.log("");
      console.log(
        "================================="
      );

      console.log(
        "NEW SEARCH REQUEST"
      );

      console.log(
        "Request body:",
        req.body
      );

      console.log(
        "================================="
      );

      const {
        problem,
        location,
        language
      } = req.body;

      // =================================================
      // VALIDATION
      // =================================================

      if (
        !problem ||
        !location ||
        !language
      ) {

        return res.status(400).json({

          status: "error",

          message:
            "Problem, location and language are required",

          received:
            req.body

        });

      }

      const searchLocation =
        String(location).trim();

      // =================================================
      // DETERMINE SERVICE
      // =================================================

      const serviceType =
        findServiceType(problem);

      console.log(
        "Requested service:",
        problem
      );

      console.log(
        "Detected service:",
        serviceType
      );

      if (!serviceType) {

        return res.json({

          status: "success",

          type: "unknown",

          location:
            searchLocation,

          language:
            language,

          count: 0,

          results: [],

          message:
            `We could not identify "${problem}". Try hospital, school, education, scholarship, college, pharmacy, clinic, police, bank or library.`

        });

      }

      // =================================================
      // GEOCODING
      // =================================================

      console.log(
        "Geocoding:",
        searchLocation
      );

      const coordinates =
        await getCoordinates(
          searchLocation
        );

      if (!coordinates) {

        return res.status(404).json({

          status: "error",

          message:
            `Location "${searchLocation}" could not be found.`,

          results: []

        });

      }

      const {
        latitude,
        longitude
      } = coordinates;

      console.log(
        "Coordinates:",
        latitude,
        longitude
      );

      // =================================================
      // SEARCH RADIUS
      // =================================================

      const radius = 10000;

      const tags =
        serviceTypes[serviceType];

      const query =
        buildOverpassQuery(
          tags,
          latitude,
          longitude,
          radius
        );

      console.log(
        "Searching nearby resources..."
      );

      // =================================================
      // OVERPASS SEARCH
      // =================================================

      const overpassData =
        await searchOverpass(
          query
        );

      if (!overpassData) {

        console.error(
          "All Overpass servers failed."
        );

        return res.status(503).json({

          status: "error",

          type:
            serviceType,

          location:
            searchLocation,

          language:
            language,

          count: 0,

          results: [],

          message:
            "The resource service is temporarily unavailable. Please try again."

        });

      }

      // =================================================
      // CONVERT RESULTS
      // =================================================

      const results =
        (
          overpassData.elements || []
        )
        .map(
          (place) =>
            createResource(
              place,
              serviceType,
              searchLocation
            )
        )
        .filter(
          (resource) =>
            resource.name &&
            resource.name.trim()
        );

      console.log(
        "Resources received:",
        results.length
      );

      // =================================================
      // REMOVE DUPLICATES
      // =================================================

      const uniqueResults =
        removeDuplicates(
          results
        );

      console.log(
        "Unique resources:",
        uniqueResults.length
      );

      // =================================================
      // LIMIT
      // =================================================

      const finalResults =
        uniqueResults.slice(
          0,
          50
        );

      console.log(
        "Final resources:",
        finalResults.length
      );

      // =================================================
      // NO RESULTS
      // =================================================

      if (
        finalResults.length === 0
      ) {

        return res.json({

          status: "success",

          type:
            serviceType,

          location:
            searchLocation,

          language:
            language,

          count: 0,

          results: [],

          message:
            `No nearby ${serviceType} resources were found within 10 km of ${searchLocation}.`

        });

      }

      // =================================================
      // SUCCESS
      // =================================================

      return res.json({

        status: "success",

        type:
          serviceType,

        location:
          searchLocation,

        language:
          language,

        count:
          finalResults.length,

        results:
          finalResults,

        message:
          `Found ${finalResults.length} nearby ${serviceType} resources near ${searchLocation}.`

      });

    }

    catch (error) {

      console.error("");
      console.error(
        "================================="
      );

      console.error(
        "SAHAAY API ERROR"
      );

      console.error(
        error
      );

      console.error(
        "================================="
      );

      return res.status(500).json({

        status: "error",

        message:
          "Unable to find nearby services right now.",

        results: [],

        error:
          error.message

      });

    }

  }
);

// =====================================================
// 404
// =====================================================

app.use(
  (req, res) => {

    res.status(404).json({

      status: "error",

      message:
        "API endpoint not found"

    });

  }
);

// =====================================================
// START SERVER
// =====================================================

const PORT =
  process.env.PORT || 5001;

app.listen(
  PORT,
  () => {

    console.log("");
    console.log(
      "================================="
    );

    console.log(
      `Sahaay server running on port ${PORT}`
    );

    console.log(
      `http://localhost:${PORT}`
    );

    console.log(
      "================================="
    );

  }
);