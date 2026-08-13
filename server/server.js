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

  // ===================================================
  // HEALTHCARE
  // ===================================================

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


  // ===================================================
  // EDUCATION
  // ===================================================

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


  // ===================================================
  // SCHOLARSHIPS
  // ===================================================

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


  // ===================================================
  // POLICE
  // ===================================================

  police: [
    '["amenity"="police"]'
  ],

  "police station": [
    '["amenity"="police"]'
  ],


  // ===================================================
  // BANK
  // ===================================================

  bank: [
    '["amenity"="bank"]'
  ],

  banks: [
    '["amenity"="bank"]'
  ],


  // ===================================================
  // ATM
  // ===================================================

  atm: [
    '["amenity"="atm"]'
  ],


  // ===================================================
  // LIBRARY
  // ===================================================

  library: [
    '["amenity"="library"]'
  ],

  libraries: [
    '["amenity"="library"]'
  ],


  // ===================================================
  // BLOOD BANK
  // ===================================================

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

  const input = String(problem)
    .toLowerCase()
    .trim();


  // ---------------------------------------------------
  // Exact match
  // ---------------------------------------------------

  if (serviceTypes[input]) {
    return input;
  }


  // ---------------------------------------------------
  // Hospital
  // ---------------------------------------------------

  if (
    input.includes("hospital") ||
    input.includes("hospitals")
  ) {

    return "hospital";

  }


  // ---------------------------------------------------
  // School
  // ---------------------------------------------------

  if (
    input.includes("school") ||
    input.includes("schools")
  ) {

    return "school";

  }


  // ---------------------------------------------------
  // Education
  // ---------------------------------------------------

  if (
    input.includes("education") ||
    input.includes("educational")
  ) {

    return "education";

  }


  // ---------------------------------------------------
  // Scholarship
  // ---------------------------------------------------

  if (
    input.includes("scholarship") ||
    input.includes("scholarships")
  ) {

    return "scholarship";

  }


  // ---------------------------------------------------
  // College
  // ---------------------------------------------------

  if (
    input.includes("college") ||
    input.includes("colleges")
  ) {

    return "college";

  }


  // ---------------------------------------------------
  // University
  // ---------------------------------------------------

  if (
    input.includes("university") ||
    input.includes("universities")
  ) {

    return "university";

  }


  // ---------------------------------------------------
  // Pharmacy
  // ---------------------------------------------------

  if (
    input.includes("pharmacy") ||
    input.includes("pharmacies")
  ) {

    return "pharmacy";

  }


  // ---------------------------------------------------
  // Clinic
  // ---------------------------------------------------

  if (
    input.includes("clinic") ||
    input.includes("clinics")
  ) {

    return "clinic";

  }


  // ---------------------------------------------------
  // Police
  // ---------------------------------------------------

  if (input.includes("police")) {

    return "police";

  }


  // ---------------------------------------------------
  // Blood Bank
  // ---------------------------------------------------

  if (
    input.includes("blood bank") ||
    input.includes("bloodbank") ||
    input.includes("blood")
  ) {

    return "blood bank";

  }


  // ---------------------------------------------------
  // Bank
  // ---------------------------------------------------

  if (
    input.includes("bank") &&
    !input.includes("blood")
  ) {

    return "bank";

  }


  // ---------------------------------------------------
  // Library
  // ---------------------------------------------------

  if (input.includes("library")) {

    return "library";

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
    [out:json][timeout:60];

    (
      ${statements}
    );

    out center tags;
  `;

}


// =====================================================
// FIND NEARBY RESOURCES
// =====================================================

app.post("/api/analyze", async (req, res) => {

  try {

    console.log("");
    console.log("=================================");
    console.log("NEW SEARCH REQUEST");
    console.log("Request body:", req.body);
    console.log("=================================");


    const {
      problem,
      location,
      language
    } = req.body;


    // =================================================
    // VALIDATION
    // =================================================

    if (!problem || !location || !language) {

      return res.status(400).json({

        status: "error",

        message:
          "Problem, location and language are required",

        received: req.body

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
      "Detected service type:",
      serviceType
    );


    if (!serviceType) {

      return res.json({

        status: "success",

        type: "unknown",

        location: searchLocation,

        language,

        count: 0,

        results: [],

        message:
          `We could not identify "${problem}". Try hospital, school, education, scholarship, college, pharmacy or police.`

      });

    }


    // =================================================
    // GEOCODING
    // =================================================

    const geocodeUrl =
      "https://nominatim.openstreetmap.org/search" +
      "?q=" +
      encodeURIComponent(searchLocation) +
      "&format=json" +
      "&limit=1";


    console.log(
      "Geocoding location:",
      searchLocation
    );


    const geocodeResponse =
      await fetch(
        geocodeUrl,
        {
          headers: {

            "User-Agent":
              "Sahaay-Community-Service-Finder/1.0"

          }
        }
      );


    if (!geocodeResponse.ok) {

      throw new Error(
        `Nominatim returned HTTP ${geocodeResponse.status}`
      );

    }


    const geocodeData =
      await geocodeResponse.json();


    console.log(
      "Geocode result:",
      geocodeData
    );


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
      parseFloat(
        geocodeData[0].lat
      );


    const longitude =
      parseFloat(
        geocodeData[0].lon
      );


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


    const overpassQuery =
      buildOverpassQuery(
        tags,
        latitude,
        longitude,
        radius
      );


    console.log(
      "Searching Overpass..."
    );


    // =================================================
    // OVERPASS SERVERS
    // =================================================

    const overpassServers = [

      "https://overpass.private.coffee/api/interpreter",

      "https://overpass-api.de/api/interpreter",

      "https://z.overpass-api.de/api/interpreter"

    ];


    let overpassData = null;


    // =================================================
    // TRY EACH OVERPASS SERVER
    // =================================================

    for (
      const server of overpassServers
    ) {

      try {

        console.log(
          "Trying Overpass server:",
          server
        );


        const overpassResponse =
          await fetch(
            server,
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "text/plain",

                "User-Agent":
                  "Sahaay-Community-Service-Finder/1.0"

              },

              body:
                overpassQuery,

              signal:
                AbortSignal.timeout(
                  45000
                )

            }
          );


        console.log(
          "Overpass HTTP status:",
          overpassResponse.status
        );


        if (
          !overpassResponse.ok
        ) {

          throw new Error(
            `Overpass returned HTTP ${overpassResponse.status}`
          );

        }


        overpassData =
          await overpassResponse.json();


        console.log(
          "Overpass elements:",
          overpassData.elements?.length || 0
        );


        // SUCCESS
        break;

      }

      catch (error) {

        console.error(
          "Overpass server failed:",
          server
        );


        console.error(
          error.message
        );

      }

    }


    // =================================================
    // ALL OVERPASS SERVERS FAILED
    // =================================================

    if (!overpassData) {

      console.error(
        "ALL OVERPASS SERVERS FAILED"
      );


      return res.status(503).json({

        status: "error",

        message:
          "The nearby resource service is temporarily unavailable. Please try again in a few seconds.",

        results: []

      });

    }


    // =================================================
    // CONVERT OSM RESULTS
    // =================================================

    const results =
      (overpassData.elements || [])
        .map((place) => {

          const tags =
            place.tags || {};


          // -------------------------------------------
          // LATITUDE
          // -------------------------------------------

          const placeLatitude =
            place.lat ??
            place.center?.lat ??
            null;


          // -------------------------------------------
          // LONGITUDE
          // -------------------------------------------

          const placeLongitude =
            place.lon ??
            place.center?.lon ??
            null;


          // -------------------------------------------
          // ADDRESS
          // -------------------------------------------

          const addressParts = [

            tags["addr:housenumber"],

            tags["addr:street"],

            tags["addr:suburb"],

            tags["addr:city"],

            tags["addr:district"],

            tags["addr:postcode"]

          ].filter(Boolean);


          const address =
            tags["addr:full"] ||

            addressParts.join(", ") ||

            tags["addr:place"] ||

            tags["addr:street"] ||

            "Address not available";


          // -------------------------------------------
          // PHONE
          // -------------------------------------------

          const phone =
            tags.phone ||

            tags["contact:phone"] ||

            tags["contact:mobile"] ||

            tags["contact:telephone"] ||

            "Phone number not available";


          // -------------------------------------------
          // WEBSITE
          // -------------------------------------------

          const website =
            tags.website ||

            tags["contact:website"] ||

            "";


          // -------------------------------------------
          // EMAIL
          // -------------------------------------------

          const email =
            tags.email ||

            tags["contact:email"] ||

            "";


          // -------------------------------------------
          // OPENING HOURS
          // -------------------------------------------

          const openingHours =
            tags.opening_hours ||

            "Opening hours not available";


          // -------------------------------------------
          // MAP URL
          // -------------------------------------------

          let mapUrl = "";


          if (
            placeLatitude !== null &&
            placeLongitude !== null
          ) {

            mapUrl =
              "https://www.google.com/maps/search/?api=1&query=" +
              `${placeLatitude},${placeLongitude}`;

          }

          else {

            mapUrl =
              "https://www.google.com/maps/search/?api=1&query=" +
              encodeURIComponent(
                `${tags.name || serviceType} ${searchLocation}`
              );

          }


          // -------------------------------------------
          // RESOURCE NAME
          // -------------------------------------------

          const resourceName =
            tags.name ||
            `${serviceType
              .charAt(0)
              .toUpperCase() +
              serviceType.slice(1)}`;


          // -------------------------------------------
          // RESOURCE OBJECT
          // -------------------------------------------

          return {

            id:
              `${place.type || "place"}-${place.id}`,

            title:
              resourceName,

            name:
              resourceName,

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
              placeLatitude,

            longitude:
              placeLongitude,

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
              new Date()
                .toLocaleDateString("en-IN")

          };

        });


    // =================================================
    // REMOVE DUPLICATES
    // =================================================

    const uniqueResults = [];

    const seenNames =
      new Set();


    for (
      const place of results
    ) {

      const name =
        place.name
          .toLowerCase()
          .trim();


      if (
        !seenNames.has(name)
      ) {

        seenNames.add(name);

        uniqueResults.push(place);

      }

    }


    // =================================================
    // LIMIT RESULTS
    // =================================================

    const finalResults =
      uniqueResults.slice(
        0,
        50
      );


    console.log(
      "Final results:",
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

        type: serviceType,

        location: searchLocation,

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

      type: serviceType,

      location: searchLocation,

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

    console.error(
      "================================="
    );


    console.error(
      "SAHAAY API ERROR:"
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

      error:
        error.message

    });

  }

});


// =====================================================
// 404
// =====================================================

app.use((req, res) => {

  res.status(404).json({

    status: "error",

    message:
      "API endpoint not found"

  });

});


// =====================================================
// START SERVER
// =====================================================

const PORT =
  process.env.PORT || 5001;


app.listen(
  PORT,
  () => {

    console.log(
      `Sahaay server running on port ${PORT}`
    );

  }
);