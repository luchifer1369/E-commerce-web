import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const mapContainerStyle = { width: '100%', height: '500px', borderRadius: '12px' };
const defaultCenter = { lat: -6.200000, lng: 106.816666 }; // Jakarta Pusat default

const Home = () => {
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState(defaultCenter);
    const [umkms, setUmkms] = useState([]);
    const [selectedUmkm, setSelectedUmkm] = useState(null);
    const [radius, setRadius] = useState(5000); // 5km default

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    });

    // Deteksi lokasi user
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => console.log('Geolocation failed, using default location.')
            );
        }
    }, []);

    // Fetch UMKM Nearby
    const fetchNearbyUmkm = useCallback(async () => {
        try {
            const res = await api.get(`/umkm/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radius}`);
            setUmkms(res.data.data);
        } catch (error) {
            console.error("Error fetching UMKM", error);
        }
    }, [userLocation, radius]);

    useEffect(() => {
        fetchNearbyUmkm();
    }, [fetchNearbyUmkm]);

    if (!isLoaded) return <div className="text-center py-10">Loading Map...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cari UMKM Terdekat</h1>
                    <p className="text-gray-500">Temukan produk lokal terbaik di sekitarmu.</p>
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-medium text-gray-700">Radius (m):</label>
                    <select 
                        className="border rounded-lg px-3 py-2"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                    >
                        <option value={1000}>1 KM</option>
                        <option value={3000}>3 KM</option>
                        <option value={5000}>5 KM</option>
                        <option value={10000}>10 KM</option>
                    </select>
                </div>
            </div>

            <div className="shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={userLocation}
                    zoom={13}
                >
                    {/* Marker Lokasi User */}
                    <Marker position={userLocation} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />

                    {/* Marker UMKM */}
                    {umkms.map((umkm) => (
                        <Marker
                            key={umkm._id}
                            position={{ lat: umkm.location.coordinates[1], lng: umkm.location.coordinates[0] }}
                            onClick={() => setSelectedUmkm(umkm)}
                        />
                    ))}

                    {/* InfoWindow saat Marker di-klik */}
                    {selectedUmkm && (
                        <InfoWindow
                            position={{ lat: selectedUmkm.location.coordinates[1], lng: selectedUmkm.location.coordinates[0] }}
                            onCloseClick={() => setSelectedUmkm(null)}
                        >
                            <div className="p-2 max-w-xs">
                                <h3 className="font-bold text-lg mb-1">{selectedUmkm.name}</h3>
                                <p className="text-sm text-gray-600 mb-2 truncate">{selectedUmkm.address}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-sm font-semibold text-yellow-500">★ {selectedUmkm.averageRating}</span>
                                    <button 
                                        onClick={() => navigate(`/umkm/${selectedUmkm._id}`)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                                    >
                                        Lihat Toko
                                    </button>
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};

export default Home;
