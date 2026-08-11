from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import math


# =========================================================
# FLASK CONFIGURATION
# =========================================================

app = Flask(__name__)

CORS(app)


# =========================================================
# RESOURCE FILE
# =========================================================

RESOURCE_FILE = os.path.join(
    os.path.dirname(__file__),
    "data",
    "resources.json"
)


# =========================================================
# LOAD RESOURCES
# =========================================================

def load_resources():

    try:

        with open(
            RESOURCE_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    except Exception as error:

        print("Resource loading error:", error)

        return []


# =========================================================
# KEYWORDS
# =========================================================

HEALTHCARE_KEYWORDS = [

    "health",
    "healthcare",
    "hospital",
    "doctor",
    "medical",
    "medicine",
    "clinic",
    "treatment",
    "sick",
    "disease",
    "fever",
    "injury",
    "ambulance",
    "nurse",
    "emergency",
    "operation",
    "surgery",
    "patient"

]


EDUCATION_KEYWORDS = [

    "education",
    "study",
    "school",
    "college",
    "university",
    "course",
    "class",
    "exam",
    "student",
    "learning",
    "teacher",
    "career",
    "degree",
    "admission",
    "fees",
    "fee",
    "books"

]


SCHOOL_KEYWORDS = [

    "school",
    "primary school",
    "high school",
    "secondary school",
    "school admission"

]


COLLEGE_KEYWORDS = [

    "college",
    "university",
    "degree",
    "engineering college",
    "arts college",
    "college admission"

]


SCHOLARSHIP_KEYWORDS = [

    "scholarship",
    "financial aid",
    "student aid",
    "education assistance",
    "financial assistance",
    "fee assistance",
    "study funding",
    "education funding",
    "student funding"

]


EMERGENCY_KEYWORDS = [

    "emergency",
    "ambulance",
    "accident",
    "critical",
    "urgent",
    "life threatening"

]


# =========================================================
# CALCULATE DISTANCE
# =========================================================

def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    try:

        earth_radius = 6371

        lat1 = math.radians(lat1)
        lat2 = math.radians(lat2)

        difference_lat = math.radians(
            lat2 - lat1
        )

        difference_lon = math.radians(
            lon2 - lon1
        )

        a = (
            math.sin(
                difference_lat / 2
            ) ** 2
            +
            math.cos(lat1)
            *
            math.cos(lat2)
            *
            math.sin(
                difference_lon / 2
            ) ** 2
        )

        c = 2 * math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a)
        )

        return round(
            earth_radius * c,
            2
        )

    except Exception:

        return None


# =========================================================
# ANALYZE USER REQUEST
# =========================================================

def analyze_request(text):

    text = text.lower().strip()


    healthcare_score = 0
    education_score = 0
    school_score = 0
    college_score = 0
    scholarship_score = 0
    emergency_score = 0


    for keyword in HEALTHCARE_KEYWORDS:

        if keyword in text:

            healthcare_score += 1


    for keyword in EDUCATION_KEYWORDS:

        if keyword in text:

            education_score += 1


    for keyword in SCHOOL_KEYWORDS:

        if keyword in text:

            school_score += 1


    for keyword in COLLEGE_KEYWORDS:

        if keyword in text:

            college_score += 1


    for keyword in SCHOLARSHIP_KEYWORDS:

        if keyword in text:

            scholarship_score += 1


    for keyword in EMERGENCY_KEYWORDS:

        if keyword in text:

            emergency_score += 1


    # =====================================================
    # EMERGENCY
    # =====================================================

    if emergency_score > 0:

        return {

            "category": "Healthcare",

            "type": "Emergency",

            "priority": "High",

            "confidence": 100

        }


    # =====================================================
    # SCHOLARSHIP
    # =====================================================

    if scholarship_score > 0:

        return {

            "category": "Scholarship",

            "type": "Government Scholarship",

            "priority": "Normal",

            "confidence": 100

        }


    # =====================================================
    # SCHOOL
    # =====================================================

    if school_score > 0:

        return {

            "category": "Education",

            "type": "School",

            "priority": "Normal",

            "confidence": 100

        }


    # =====================================================
    # COLLEGE
    # =====================================================

    if college_score > 0:

        return {

            "category": "Education",

            "type": "College",

            "priority": "Normal",

            "confidence": 100

        }


    # =====================================================
    # HEALTHCARE
    # =====================================================

    if healthcare_score > education_score:

        return {

            "category": "Healthcare",

            "type": "Healthcare",

            "priority": "Normal",

            "confidence": round(
                (
                    healthcare_score
                    /
                    max(
                        healthcare_score
                        +
                        education_score,
                        1
                    )
                ) * 100,
                2
            )

        }


    # =====================================================
    # EDUCATION
    # =====================================================

    if education_score > 0:

        return {

            "category": "Education",

            "type": "Education",

            "priority": "Normal",

            "confidence": 100

        }


    # =====================================================
    # UNKNOWN
    # =====================================================

    return {

        "category": "Unknown",

        "type": "Unknown",

        "priority": "Normal",

        "confidence": 0

    }


# =========================================================
# FIND RESOURCES
# =========================================================

def find_resources(
    category,
    resource_type,
    location
):

    resources = load_resources()


    # =====================================================
    # CATEGORY FILTER
    # =====================================================

    if category != "Unknown":

        resources = [

            resource

            for resource in resources

            if resource.get(
                "category"
            ) == category

        ]


    # =====================================================
    # TYPE FILTER
    # =====================================================

    if resource_type not in [

        "Healthcare",
        "Education",
        "Unknown",
        "Emergency",
        "Government Scholarship"

    ]:

        type_results = [

            resource

            for resource in resources

            if resource.get(
                "type"
            ) == resource_type

        ]

        if type_results:

            resources = type_results


    elif resource_type in [

        "School",
        "College",
        "Clinic",
        "Hospital"

    ]:

        type_results = [

            resource

            for resource in resources

            if resource.get(
                "type"
            ) == resource_type

        ]

        if type_results:

            resources = type_results


    # =====================================================
    # LOCATION FILTER
    # =====================================================

    if location:

        location_lower = location.lower()


        location_results = [

            resource

            for resource in resources

            if location_lower
            in resource.get(
                "location",
                ""
            ).lower()

        ]


        if location_results:

            resources = location_results


    return resources


# =========================================================
# HOME
# =========================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "success": True,

        "application": "SAHAAY",

        "message":
            "SAHAAY backend is running",

        "version":
            "1.0"

    })


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route(
    "/api/health",
    methods=["GET"]
)
def health():

    return jsonify({

        "success": True,

        "message":
            "SAHAAY backend is running"

    })


# =========================================================
# GET ALL RESOURCES
# =========================================================

@app.route(
    "/api/resources",
    methods=["GET"]
)
def get_resources():

    resources = load_resources()

    return jsonify({

        "success": True,

        "count": len(resources),

        "resources": resources

    })


# =========================================================
# ANALYZE USER REQUEST
# =========================================================

@app.route(
    "/api/analyze",
    methods=["POST"]
)
def analyze():

    try:

        data = request.get_json()


        if not data:

            return jsonify({

                "success": False,

                "message":
                    "No data received."

            }), 400


        problem = data.get(
            "problem",
            ""
        ).strip()


        location = data.get(
            "location",
            ""
        ).strip()


        if not problem:

            return jsonify({

                "success": False,

                "message":
                    "Please enter your problem."

            }), 400


        # =================================================
        # ANALYZE
        # =================================================

        analysis = analyze_request(
            problem
        )


        category = analysis[
            "category"
        ]

        resource_type = analysis[
            "type"
        ]

        priority = analysis[
            "priority"
        ]

        confidence = analysis[
            "confidence"
        ]


        # =================================================
        # FIND RESOURCES
        # =================================================

        resources = find_resources(

            category,

            resource_type,

            location

        )


        return jsonify({

            "success": True,

            "problem": problem,

            "location": location,

            "category": category,

            "type": resource_type,

            "priority": priority,

            "confidence": confidence,

            "count": len(resources),

            "resources": resources

        })


    except Exception as error:

        print(
            "API Error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Something went wrong."

        }), 500


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    print("")
    print("==============================")
    print("        SAHAAY BACKEND")
    print("==============================")
    print("Server starting...")
    print("")

    app.run(

        host="0.0.0.0",

        port=5001,

        debug=True

    )