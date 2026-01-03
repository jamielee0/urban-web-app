import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MapLayer } from '../../types';

// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  layers?: MapLayer[];
  onLayerUpdate?: (layers: MapLayer[]) => void;
  height?: string;
}

function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  return null;
}

export default function InteractiveMap({
  center = [20, 0],
  zoom = 2,
  layers = [],
  onLayerUpdate,
  height = '600px',
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div 
      className="w-full rounded-[22px] overflow-hidden"
      style={{
        height,
        border: '1px solid rgba(255,255,255,.12)',
        background: 'rgba(0,0,0,.14)'
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', background: 'rgba(0,0,0,.2)' }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} />
        {/* Layer overlays would be rendered here */}
      </MapContainer>
    </div>
  );
}
