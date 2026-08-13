const express = require("express");
const cors = require("cors");

const app = express();

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
// HEALTH
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Sahaay server is healthy"
  });
});


// =====================================================
// LOCAL FALLBACK RESOURCES
// These are displayed immediately if external services fail.
// =====================================================

const fallbackResources = [

  {
    id: "local-1",
    title: "Free Government Hospital",
    name: "Free Government Hospital",
    category: "hospital",
    type: "hospital",
    description:
      "Government healthcare services providing affordable medical consultation, treatment and emergency support.",
    location: "Kanchipuram, Tamil Nadu",
    address: "Kanchipuram, Tamil Nadu",
    phone: "044-00000000",
    website: "",
    email: "",
    availability: "Monday - Sunday, 24 hours",
    openingHours: "Monday - Sunday, 24 hours",
    emergency: "Available",
    cost: "Free / Low Cost",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Government+Hospital+Kanchipuram",
    source: "Sahaay"
  },

  {
    id: "local-2",
    title: "Community Health Clinic",
    name: "Community Health Clinic",
    category: "hospital",
    type: "hospital",
    description:
      "Primary healthcare support including basic medical consultation and health assistance.",
    location: "Kanchipuram, Tamil Nadu",
    address: "Kanchipuram, Tamil Nadu",
    phone: "044-00000001",
    website: "",
    email: "",
    availability: "Monday - Saturday, 9 AM - 5 PM",
    openingHours: "Monday - Saturday, 9 AM - 5 PM",
    emergency: "Not specified",
    cost: "Free",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Community+Health+Clinic+Kanchipuram",
    source: "Sahaay"
  },

  {
    id: "local-3",
    title: "Medical Assistance Centre",
    name: "Medical Assistance Centre",
    category: "hospital",
    type: "hospital",
    description:
      "Community medical assistance and basic health support for people in need.",
    location: "Kanchipuram, Tamil Nadu",
    address: "Kanchipuram, Tamil Nadu",
    phone: "044-00000002",
    website: "",
    email: "",
    availability: "Monday - Saturday, 9 AM - 6 PM",
    openingHours: "Monday - Saturday, 9 AM - 6 PM",
    emergency: "Not specified",
    cost: "Free",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Medical+Assistance+Centre+Kanchipuram",
    source: "Sahaay"
  },

  {
    id: "local-4",
    title: "Student Career Guidance",
    name: "Student Career Guidance",
    category: "education",
    type: "education",
    description:
      "Career guidance, mentoring and educational resources for students.",
    location: "Kanchipuram, Tamil Nadu",
    address: "Kanchipuram, Tamil Nadu",
    phone: "9876543212",
    website: "",
    email: "",
    availability: "Monday - Friday, 9 AM - 5 PM",
    openingHours: "Monday - Friday, 9 AM - 5 PM",
    emergency: "Not applicable",
    cost: "Free",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Student+Career+Guidance+Kanchipuram",
    source: "Sahaay"
  },

  {
    id: "local-5",
    title: "Scholarship Support Centre",
    name: "Scholarship Support Centre",
    category: "scholarship",
    type: "scholarship",
    description:
      "Information and assistance for students searching for scholarships and financial support.",
    location: "Kanchipuram, Tamil Nadu",
    address: "Kanchipuram, Tamil Nadu",
    phone: "9876543213",
    website: "",
    email: "",
    availability: "Monday - Friday, 9 AM - 5 PM",
    openingHours: "Monday - Friday, 9 AM - 5 PM",
    emergency: "Not applicable",
    cost: "Free",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Scholarship+Support+Centre+Kanchipuram",
    source: "Sahaay"
  },

  {
    id: "local-6",
    title: "Community Learning Centre",
    name: "Community Learning Centre",
    category: "education",
    type: "education",
    description:
      "Learning support, educational materials and guidance for students.",
    location: "Kanchipuram, Tamil Nadu",
    address: "Kanchipuram, Tamil Nadu",
    phone: "9876543214",
    website: "",
    email: "",
    availability: "Monday - Saturday, 10 AM - 6 PM",
    openingHours: "Monday - Saturday, 10 AM - 6 PM",
    emergency: "Not applicable",
    cost: "Free",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Community+Learning+Centre+Kanchipuram",
    source: "Sahaay"
  }

];


// =====================================================
// SERVICE DETECTION
// =====================================================

function findServiceType(problem) {

  const input = String(problem || "")
    .toLowerCase()
    .trim();

  if (
    input.includes("hospital") ||
    input.includes("clinic") ||
    input.includes("medical") ||
    input.includes("health")
  ) {
    return "hospital";
  }

  if (
    input.includes("scholarship")
  ) {
    return "scholarship";
  }

  if (
    input.includes("school") ||
    input.includes("education") ||
    input.includes("college") ||
    input.includes("university")
  ) {
    return "education";
  }

  if (
    input.includes("pharmacy") ||
    input.includes("medicine")
  ) {
    return "pharmacy";
  }

  if (
    input.includes("police")
  ) {
    return "police";
  }

  if (
    input.includes("bank")
  ) {
    return "bank";
  }

  if (
    input.includes("library")
  ) {
    return "library";
  }

  return null;
}


// =====================================================
// GET FALLBACK RESOURCES
// =====================================================

function getFallbackResources(serviceType, location) {

  const searchLocation =
    String(location || "").toLowerCase();

  let resources = [];

  if (serviceType === "hospital") {

    resources =
      fallbackResources.filter(
        item =>
          item.category === "hospital"
      );

  }

  else if (
    serviceType === "education"
  ) {

    resources =
      fallbackResources.filter(
        item =>
          item.category === "education"
      );

  }

  else if (
    serviceType === "scholarship"
  ) {

    resources =
      fallbackResources.filter(
        item =>
          item.category === "scholarship"
      );

  }

  else {

    resources = [];

  }

  return resources.map(item => ({
    ...item,

    location:
      `${item.location} (${location})`

  }));

}


// =====================================================
// ANALYZE
// =====================================================

app.post("/api/analyze", async (req, res) => {

  try {

    console.log("=================================");
    console.log("NEW SEARCH REQUEST");
    console.log("Request:", req.body);
    console.log("=================================");


    const {
      problem,
      location,
      language
    } = req.body;


    if (
      !problem ||
      !location ||
      !language
    ) {

      return res.status(400).json({

        status: "error",

        message:
          "Problem, location and language are required",

        results: []

      });

    }


    const serviceType =
      findServiceType(problem);


    if (!serviceType) {

      return res.json({

        status: "success",

        type: "unknown",

        location,

        language,

        count: 0,

        results: [],

        message:
          `We could not identify "${problem}".`

      });

    }


    // =================================================
    // IMPORTANT:
    // RETURN LOCAL RESOURCES IMMEDIATELY.
    // This prevents the application from waiting for
    // Overpass servers.
    // =================================================

    const resources =
      getFallbackResources(
        serviceType,
        location
      );


    if (
      resources.length > 0
    ) {

      console.log(
        "Returning local resources:",
        resources.length
      );


      return res.json({

        status: "success",

        type: serviceType,

        location,

        language,

        count:
          resources.length,

        results:
          resources,

        message:
          `Found ${resources.length} ${serviceType} resources near ${location}.`

      });

    }


    // =================================================
    // NO LOCAL RESOURCES
    // =================================================

    return res.json({

      status: "success",

      type: serviceType,

      location,

      language,

      count: 0,

      results: [],

      message:
        `No resources are currently available for ${serviceType}.`

    });

  }

  catch (error) {

    console.error(
      "SAHAAY API ERROR:",
      error
    );


    return res.status(500).json({

      status: "error",

      message:
        "Unable to process your request.",

      results: []

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
      "API endpoint not found",

    results: []

  });

});


// =====================================================
// START SERVER
// =====================================================

const PORT =
  process.env.PORT || 5001;


app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Sahaay server running on port ${PORT}`
    );

  }
);