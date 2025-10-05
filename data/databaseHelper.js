const API_URL = "https://backend-compsciety.vercel.app/api/users";

export async function storeToDatabase(jsonData) {
  try {
    const res = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(jsonData),
    });

    if (!res.ok) {
      console.error("Failed to sendToDB:", await res.text());
      return;
    } else console.log("Successfully updated db!", await res.json());
  } catch (error) {
    console.error("Error sending to API", error);
  }
}
