export async function getAPOD() {
  const res = await fetch(
    "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
  );
  return await res.json();
}
