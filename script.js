function saveEvent() {
  const titulo = document.getElementById('title').value.trim();
  const categoria = document.getElementById('category').value;
  const fechaInput = document.getElementById('date').value;
  const horaInput = document.getElementById('time').value;
  const descripcion = document.getElementById('description').value.trim();
  const ubicacionStr = document.getElementById('location').value.trim();

  // Validaciones estrictas
  if (!titulo) {
    alert('⚠️ Por favor, escribe un título para el evento.');
    return;
  }
  if (!fechaInput) {
    alert('⚠️ Selecciona una fecha.');
    return;
  }
  if (!horaInput) {
    alert('⚠️ Selecciona una hora.');
    return;
  }
  if (!ubicacionStr) {
    alert('⚠️ Indica una ubicación (lat, lng) o selecciona en el mapa.');
    return;
  }

  const coords = ubicacionStr.split(',').map(s => parseFloat(s.trim()));
  if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
    alert('⚠️ La ubicación debe tener el formato: latitud, longitud (ej: -33.749, -53.347)');
    return;
  }

  // Crear objeto fecha combinando fecha y hora
  const fechaHora = new Date(`${fechaInput}T${horaInput}:00`);
  if (isNaN(fechaHora.getTime())) {
    alert('⚠️ La fecha u hora no son válidas.');
    return;
  }

  const data = {
    titulo: titulo,
    categoria: categoria,
    fecha: fechaHora,
    fechaStr: fechaInput,
    hora: horaInput,
    descripcion: descripcion,
    ubicacion: `${coords[0]}, ${coords[1]}`,
    lat: coords[0],
    lng: coords[1],
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  // Guardar en Firestore con manejo de errores detallado
  db.collection('eventos')
    .add(data)
    .then((docRef) => {
      console.log('Evento guardado con ID:', docRef.id);
      alert('✅ Evento guardado con éxito.');
      // Limpiar formulario
      document.getElementById('title').value = '';
      document.getElementById('description').value = '';
      document.getElementById('location').value = `${DEFAULT_LAT}, ${DEFAULT_LNG}`;
      if (marker) {
        marker.setLatLng([DEFAULT_LAT, DEFAULT_LNG]);
        map.setView([DEFAULT_LAT, DEFAULT_LNG], 13);
      }
      hideForm();
    })
    .catch((error) => {
      console.error('❌ Error al guardar:', error);
      alert('❌ Error al guardar el evento: ' + error.message);
    });
}
