import React, { useState } from "react";

function NewPlantForm({ onPlantCreated }) {
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const plant = {
      name: formData.get("name"),
      image: formData.get("image"),
      price: formData.get("price"),
    };

    try {
      const response = await fetch("http://localhost:6001/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plant),
      });
      if (!response.ok) {
        throw new Error(`Unable to add plant (${response.status}).`);
      }

      const createdPlant = await response.json();
      onPlantCreated(createdPlant);
      setError("");
      form.reset();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <div className="new-plant-form">
      <h2>New Plant</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Plant name" required />
        <input type="text" name="image" placeholder="Image URL" required />
        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Price"
          required
        />
        <button type="submit">Add Plant</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default NewPlantForm;
