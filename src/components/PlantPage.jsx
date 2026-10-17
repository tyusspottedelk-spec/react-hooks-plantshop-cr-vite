import React, { useEffect, useState } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadPlants() {
      try {
        const response = await fetch("http://localhost:6001/plants");
        if (!response.ok) {
          throw new Error(`Unable to load plants (${response.status}).`);
        }

        const loadedPlants = await response.json();
        if (isCurrent) {
          setPlants(loadedPlants);
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message);
        }
      }
    }

    loadPlants();
    return () => {
      isCurrent = false;
    };
  }, []);

  function handlePlantCreated(plant) {
    setPlants((currentPlants) => [...currentPlants, plant]);
    setError("");
  }

  const visiblePlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onPlantCreated={handlePlantCreated} />
      <Search searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      {error && <p role="alert">{error}</p>}
      <PlantList plants={visiblePlants} />
    </main>
  );
}

export default PlantPage;
