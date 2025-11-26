navigator.geolocation.watchPosition((pos) => {
const latitude = pos.coords.latitude; 
const longitude = pos.coords.longitude; 
// send to backend 
fetch("http://your-backend-ip/api/updateLocation", { 
  method: "POST", 
  headers: { "Content-Type": "application/json" }, 
  body: JSON.stringify({ 
    regNumber: "KA01AB1234", 
    latitude, 
    longitude 
  }) 
}); 
});