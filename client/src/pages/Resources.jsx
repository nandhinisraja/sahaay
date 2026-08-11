import { useMemo, useState } from "react";

import {
  Search,
  Filter,
  MapPin,
  Heart,
  BookOpen,
  GraduationCap,
  Hospital,
  School
} from "lucide-react";

import ResourceCard from "../components/ResourceCard";

import resourcesData from "../data/resources.json";

import "./Resources.css";


function Resources() {

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [saved, setSaved] = useState([]);


  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "All",
    "Healthcare",
    "Education",
    "Scholarships",
    "Hospitals",
    "Schools"
  ];


  // =====================================================
  // RESOURCE FILTER
  // =====================================================

  const filteredResources = useMemo(() => {

    return resourcesData.filter((resource) => {

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        resource.title
          ?.toLowerCase()
          .includes(searchText) ||
        resource.description
          ?.toLowerCase()
          .includes(searchText) ||
        resource.location
          ?.toLowerCase()
          .includes(searchText) ||
        resource.category
          ?.toLowerCase()
          .includes(searchText);


      const matchesCategory =
        category === "All" ||
        resource.category
          ?.toLowerCase()
          .includes(category.toLowerCase());


      return (
        matchesSearch &&
        matchesCategory
      );

    });

  }, [search, category]);


  // =====================================================
  // SAVE RESOURCE
  // =====================================================

  const toggleSave = (id) => {

    setSaved((previous) => {

      if (previous.includes(id)) {

        return previous.filter(
          (savedId) => savedId !== id
        );

      }

      return [
        ...previous,
        id
      ];

    });

  };


  // =====================================================
  // CATEGORY ICON
  // =====================================================

  const getCategoryIcon = (name) => {

    switch (name) {

      case "Healthcare":
        return <Hospital size={18} />;

      case "Education":
        return <BookOpen size={18} />;

      case "Scholarships":
        return <GraduationCap size={18} />;

      case "Hospitals":
        return <Hospital size={18} />;

      case "Schools":
        return <School size={18} />;

      default:
        return <Heart size={18} />;

    }

  };


  return (

    <main className="resources-page">


      {/* =================================================
          HERO
      ================================================= */}

      <section className="resources-hero">

        <div className="resources-hero-content">

          <span className="resources-label">
            SAHAAY RESOURCES
          </span>

          <h1>
            Find the help you need
          </h1>

          <p>
            Discover healthcare, education,
            scholarships, schools and other
            essential resources near you.
          </p>

        </div>

      </section>


      {/* =================================================
          SEARCH AREA
      ================================================= */}

      <section className="resources-search-section">

        <div className="resources-search-box">

          <Search size={20} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search hospitals, schools, scholarships..."
          />

        </div>


        <div className="category-filter">

          <Filter size={18} />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >

            {categories.map((item) => (

              <option
                key={item}
                value={item}
              >
                {item}
              </option>

            ))}

          </select>

        </div>

      </section>


      {/* =================================================
          CATEGORY BUTTONS
      ================================================= */}

      <section className="category-buttons">

        {categories.map((item) => (

          <button
            key={item}
            type="button"
            className={
              category === item
                ? "category-button active"
                : "category-button"
            }
            onClick={() =>
              setCategory(item)
            }
          >

            {getCategoryIcon(item)}

            <span>
              {item}
            </span>

          </button>

        ))}

      </section>


      {/* =================================================
          RESULTS INFORMATION
      ================================================= */}

      <section className="resources-results-header">

        <div>

          <h2>
            {category === "All"
              ? "All Resources"
              : category}
          </h2>

          <p>
            {filteredResources.length} resource
            {filteredResources.length !== 1
              ? "s"
              : ""}{" "}
            available
          </p>

        </div>


        {saved.length > 0 && (

          <div className="saved-count">

            <Heart size={17} />

            {saved.length} saved

          </div>

        )}

      </section>


      {/* =================================================
          RESOURCE GRID
      ================================================= */}

      {filteredResources.length > 0 ? (

        <section className="resources-grid">

          {filteredResources.map(
            (resource) => (

              <ResourceCard
                key={resource.id}
                resource={resource}
                saved={saved.includes(resource.id)}
                onSave={() =>
                  toggleSave(resource.id)
                }
              />

            )
          )}

        </section>

      ) : (

        <section className="resources-empty">

          <Search size={45} />

          <h3>
            No resources found
          </h3>

          <p>
            Try another search term or
            choose a different category.
          </p>

          <button
            type="button"
            onClick={() => {

              setSearch("");
              setCategory("All");

            }}
          >
            Clear Search
          </button>

        </section>

      )}


      {/* =================================================
          LOCATION INFORMATION
      ================================================= */}

      <section className="resources-info">

        <MapPin size={25} />

        <div>

          <h3>
            Looking for help near you?
          </h3>

          <p>
            Go to the SAHAAY home page and
            enter your location to find
            resources around you.
          </p>

        </div>

      </section>


    </main>

  );

}


export default Resources;