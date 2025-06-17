import React, { useState } from 'react';

const HotelAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // Datos estáticos de las habitaciones
  const rooms = [
    { id: 1, type: 'individual', number: '101', price: 500, occupied: false, features: ['WiFi', 'TV'] },
    { id: 2, type: 'individual', number: '102', price: 500, occupied: true, features: ['WiFi', 'TV'] },
    { id: 3, type: 'individual', number: '103', price: 500, occupied: false, features: ['WiFi', 'TV', 'A/C'] },
    { id: 4, type: 'individual', number: '104', price: 500, occupied: true, features: ['WiFi', 'TV'] },
    { id: 5, type: 'individual', number: '105', price: 500, occupied: false, features: ['WiFi', 'TV', 'A/C'] },
    
    { id: 6, type: 'doble', number: '201', price: 800, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Caja fuerte'] },
    { id: 7, type: 'doble', number: '202', price: 800, occupied: false, features: ['WiFi', 'TV', 'A/C'] },
    { id: 8, type: 'doble', number: '203', price: 800, occupied: true, features: ['WiFi', 'TV', 'A/C', 'Caja fuerte'] },
    { id: 9, type: 'doble', number: '204', price: 800, occupied: false, features: ['WiFi', 'TV', 'A/C'] },
    { id: 10, type: 'doble', number: '205', price: 800, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Minibar'] },
    { id: 11, type: 'doble', number: '206', price: 800, occupied: true, features: ['WiFi', 'TV', 'A/C'] },
    { id: 12, type: 'doble', number: '207', price: 800, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Minibar'] },
    { id: 16, type: 'doble', number: '208', price: 800, occupied: true, features: ['WiFi', 'TV', 'A/C', 'Vista al mar'] },
    { id: 17, type: 'doble', number: '209', price: 800, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Balcón'] },
    { id: 18, type: 'doble', number: '210', price: 800, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Caja fuerte'] },
    
    { id: 13, type: 'suite', number: '301', price: 1200, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Minibar', 'Jacuzzi', 'Vista al mar'] },
    { id: 14, type: 'suite', number: '302', price: 1200, occupied: true, features: ['WiFi', 'TV', 'A/C', 'Minibar', 'Jacuzzi'] },
    { id: 15, type: 'suite', number: '303', price: 1200, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Minibar', 'Jacuzzi', 'Vista al mar'] },
    { id: 19, type: 'suite', number: '304', price: 1200, occupied: true, features: ['WiFi', 'TV', 'A/C', 'Minibar', 'Jacuzzi', 'Terraza'] },
    { id: 20, type: 'suite', number: '305', price: 1200, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Minibar', 'Jacuzzi', 'Vista al mar'] },
    
    // Habitaciones adicionales
    { id: 21, type: 'individual', number: '106', price: 500, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Escritorio'] },
    { id: 22, type: 'individual', number: '107', price: 500, occupied: true, features: ['WiFi', 'TV'] },
    { id: 23, type: 'individual', number: '108', price: 500, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Vista al jardín'] },
    
    { id: 24, type: 'doble', number: '211', price: 800, occupied: false, features: ['WiFi', 'TV', 'A/C', 'Sofá cama'] },
    { id: 25, type: 'doble', number: '212', price: 800, occupied: true, features: ['WiFi', 'TV', 'A/C', 'Caja fuerte'] }
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setSelectedDate(e.target.value);
    
    // Simulamos una carga breve
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const countAvailableRooms = (type: string) => {
    return rooms.filter(room => room.type === type && !room.occupied).length;
  };

  const totalRoomsByType = (type: string) => {
    return rooms.filter(room => room.type === type).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Disponibilidad de Habitaciones</h1>
        
        <div className="flex items-center mb-6">
          <label htmlFor="checkin-date" className="mr-2 font-medium">Fecha de consulta:</label>
          <input
            type="date"
            id="checkin-date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="border rounded px-3 py-2"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">Buscando disponibilidad para {selectedDate}...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className={`border rounded-lg p-4 ${countAvailableRooms('individual') > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="font-bold text-lg mb-2">Habitaciones Individuales</h3>
                <p className="mb-1">Disponibles: {countAvailableRooms('individual')} de {totalRoomsByType('individual')}</p>
                <p className="mb-1">Precio: $500/noche</p>
                <p className="text-sm text-gray-600">Cama individual, WiFi, TV</p>
              </div>
              
              <div className={`border rounded-lg p-4 ${countAvailableRooms('doble') > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="font-bold text-lg mb-2">Habitaciones Dobles</h3>
                <p className="mb-1">Disponibles: {countAvailableRooms('doble')} de {totalRoomsByType('doble')}</p>
                <p className="mb-1">Precio: $800/noche</p>
                <p className="text-sm text-gray-600">Cama matrimonial, WiFi, TV, A/C</p>
              </div>
              
              <div className={`border rounded-lg p-4 ${countAvailableRooms('suite') > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="font-bold text-lg mb-2">Suites</h3>
                <p className="mb-1">Disponibles: {countAvailableRooms('suite')} de {totalRoomsByType('suite')}</p>
                <p className="mb-1">Precio: $1200/noche</p>
                <p className="text-sm text-gray-600">Amplio espacio, Jacuzzi, Vista privilegiada</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">N° Habitación</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio/noche</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Comodidades</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room.id} className={room.occupied ? 'bg-red-50' : 'bg-white hover:bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">{room.number}</td>
                      <td className="px-4 py-3 whitespace-nowrap capitalize">{room.type}</td>
                      <td className="px-4 py-3 whitespace-nowrap">${room.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {room.features.map((feature, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {room.occupied ? 'Ocupada' : 'Disponible'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          disabled={room.occupied}
                          className={`px-3 py-1 rounded text-sm font-medium ${room.occupied 
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          {room.occupied ? 'No disponible' : 'Reservar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HotelAvailability;