import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface AreaHighlighterProps {
  onBoundariesChange: (boundaries: any) => void;
  boundaries: any;
}

function DrawingHandler({
  onBoundariesChange,
  boundaries,
}: {
  onBoundariesChange: (boundaries: any) => void;
  boundaries: any;
}) {
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useMapEvents({
    click(e) {
      if (isDrawing) {
        setPolygonPoints([...polygonPoints, [e.latlng.lat, e.latlng.lng]]);
      }
    },
  });

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setPolygonPoints([]);
  };

  const handleFinishDrawing = () => {
    setIsDrawing(false);
    if (polygonPoints.length >= 3) {
      const geoJson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[...polygonPoints.map((p) => [p[1], p[0]])]],
        },
      };
      onBoundariesChange({
        type: 'FeatureCollection',
        features: [geoJson],
      });
    }
  };

  const handleClear = () => {
    setPolygonPoints([]);
    onBoundariesChange(null);
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] rounded-2xl p-4 space-y-2"
         style={{
           background: 'rgba(0,0,0,.85)',
           border: '1px solid rgba(255,255,255,.12)',
           boxShadow: '0 10px 26px rgba(0,0,0,.40)'
         }}>
      <button
        onClick={handleStartDrawing}
        className="w-full px-4 py-2 rounded-[14px] font-semibold"
        style={{
          background: 'linear-gradient(180deg, rgba(127,224,255,.20), rgba(127,224,255,.12))',
          border: '1px solid rgba(127,224,255,.30)',
          color: 'var(--text)'
        }}
      >
        Start Drawing
      </button>
      {isDrawing && (
        <button
          onClick={handleFinishDrawing}
          className="w-full px-4 py-2 rounded-[14px] font-semibold"
          style={{
            background: 'linear-gradient(180deg, rgba(119,242,193,.20), rgba(119,242,193,.12))',
            border: '1px solid rgba(119,242,193,.30)',
            color: 'var(--text)'
          }}
        >
          Finish Drawing
        </button>
      )}
      <button
        onClick={handleClear}
        className="w-full px-4 py-2 rounded-[14px] font-semibold"
        style={{
          background: 'rgba(255,122,138,.15)',
          border: '1px solid rgba(255,122,138,.30)',
          color: '#ff7a8a'
        }}
      >
        Clear
      </button>
    </div>
  );
}

export default function AreaHighlighter({
  onBoundariesChange,
  boundaries,
}: AreaHighlighterProps) {
  const polygonCoordinates =
    boundaries?.features?.[0]?.geometry?.coordinates?.[0]?.map((coord: number[]) => [
      coord[1],
      coord[0],
    ]) || [];

  return (
    <div className="h-96 w-full rounded-2xl overflow-hidden"
         style={{
           border: '1px solid rgba(255,255,255,.12)',
           background: 'rgba(0,0,0,.14)'
         }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DrawingHandler onBoundariesChange={onBoundariesChange} boundaries={boundaries} />
        {polygonCoordinates.length > 0 && (
          <Polygon
            positions={polygonCoordinates}
            pathOptions={{ 
              color: '#7fe0ff', 
              fillColor: '#7fe0ff', 
              fillOpacity: 0.3,
              weight: 2
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
