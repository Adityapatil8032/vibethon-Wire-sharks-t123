async function test() {
  try {
    const response = await fetch('http://localhost:3000/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: [80, 70, 60], currentLoss: 0.5 })
    });
    const data = await response.json();
    console.log("Response:", data);
  } catch (error: any) {
    console.error("Error:", error?.message || error);
  }
}

test();
