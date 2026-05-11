export async function getAPOD() {
  const response = await fetch(
    "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
  );

  if (!response.ok) {
    throw new Error("Unable to fetch NASA APOD.");
  }

  return response.json();
}
