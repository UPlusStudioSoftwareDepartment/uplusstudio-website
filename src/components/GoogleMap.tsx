"use client";

import { useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface GoogleMapProps {
  address: string;
  height: string;
  zoom: number;
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <span className="text-gray-500">Loading map...</span>
      </div>;
    case Status.FAILURE:
      return <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <span className="text-gray-500">Error loading map</span>
      </div>;
    case Status.SUCCESS:
      return <MapComponent />;
    default:
      return <></>;
  }
};

const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 39.8794, lng: 32.7348 }, // Ankara coordinates
      zoom: 16,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ weight: "2.00" }]
        },
        {
          featureType: "all",
          elementType: "geometry.stroke",
          stylers: [{ color: "#9c9c9c" }]
        },
        {
          featureType: "all",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }]
        }
      ]
    });

    const marker = new window.google.maps.Marker({
      position: { lat: 39.8794, lng: 32.7348 },
      map: map,
      title: "UPlus Studio"
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default function GoogleMap({ address, height, zoom }: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Fallback placeholder when API key is not available
  if (!apiKey) {
    return (
      <div style={{ height }} className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Map View</h3>
            <p className="text-sm text-gray-600 mb-4">{address}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-sm">
              <p className="text-xs text-blue-700">
                <strong>Developer:</strong> Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local to enable interactive maps
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <Wrapper 
        apiKey={apiKey} 
        render={render}
        libraries={['places']}
      />
    </div>
  );
}
