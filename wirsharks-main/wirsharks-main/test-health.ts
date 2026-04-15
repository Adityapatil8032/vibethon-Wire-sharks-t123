async function test() {
  const response = await fetch('http://localhost:3000/api/health');
  const data = await response.json();
  console.log(data);
}
test();
