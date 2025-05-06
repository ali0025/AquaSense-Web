// Firebase configuration (move to environment variables in production)
const firebaseConfig = {
  apiKey: "AIzaSyDgLHnDun1K2gSqCabIxXE86I4Xm0mvA5s",
  authDomain: "iot-based-8de6a.firebaseapp.com",
  databaseURL: "https://iot-based-8de6a-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "iot-based-8de6a",
  storageBucket: "iot-based-8de6a.appspot.com",
  messagingSenderId: "787898", // Corrected to numeric ID
  appId: "787898"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const sensorsRef = database.ref('sensors');

let lastData = {};

sensorsRef.on('value', (snapshot) => {
  const data = snapshot.val();
  const container = document.getElementById('sensorData');
  let statusElement = document.getElementById('statusMessage');

  // Define expected sensor keys
  const sensorKeys = ['humidity', 'tempC', 'accelX', 'accelY', 'accelZ', 'turbidity', 'pH'];

  if (data && typeof data === 'object' && sensorKeys.every(key => key in data)) {
    // Check if all sensor values are exactly 0
    const allZeros = sensorKeys.every(key => data[key] === 0);

    if (allZeros) {
      // All values are 0: treat as hardware not connected
      if (!statusElement) {
        statusElement = document.createElement('p');
        statusElement.id = 'statusMessage';
        container.appendChild(statusElement);
      }
      statusElement.textContent = "❌ Hardware connection";
      statusElement.className = 'alert';
      statusElement.style.border = "2px solid red";
      statusElement.style.textAlign = "center";
      statusElement.style.gridColumn = "span 1";
    } else {
      // Non-zero values: update sensor data
      sensorKeys.forEach(id => {
        const element = document.getElementById(id);
        if (element && typeof data[id] === 'number') {
          element.textContent = data[id].toFixed(2);
        }
      });

      // Check for changes
      const changed = sensorKeys.some(key => data[key] !== lastData[key]);

      // Update status message
      if (!statusElement) {
        statusElement = document.createElement('p');
        statusElement.id = 'statusMessage';
        container.appendChild(statusElement);
      }
      if (changed) {
        statusElement.textContent = "✅ Live data";
        statusElement.className = 'normal';
        statusElement.style.border = "2px solid #4CAF50";
        statusElement.style.textAlign = "center";
        lastData = { ...data };
      }
    }
  } else {
    // No data or incomplete data: show hardware not connected
    if (!statusElement) {
      statusElement = document.createElement('p');
      statusElement.id = 'statusMessage';
      container.appendChild(statusElement);
    }
    statusElement.textContent = "❌ Hardware connection";
    statusElement.className = 'alert';
    statusElement.style.border = "2px solid red";
    statusElement.style.textAlign = "center";
    statusElement.style.gridColumn = "span 1";
  }
}, (error) => {
  console.error('Error fetching data:', error);
  const container = document.getElementById('sensorData');
  let statusElement = document.getElementById('statusMessage');
  if (!statusElement) {
    statusElement = document.createElement('p');
    statusElement.id = 'statusMessage';
    container.appendChild(statusElement);
  }
  statusElement.textContent = "⚠️ Failed to fetch data";
  statusElement.className = 'alert';
  statusElement.style.border = "2px solid orange";
  statusElement.style.textAlign = "center";
});