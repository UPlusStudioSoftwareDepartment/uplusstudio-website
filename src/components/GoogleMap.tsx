"use client";

import { useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface GoogleMapProps {
  address: string;
  height: string;
  zoom: number;
}

const STUDIO_POSITION = { lat: 39.8794, lng: 32.7348 };

const GRAYSCALE_STYLES = [
  { elementType: 'geometry', stylers: [{ saturation: -100 }, { lightness: 8 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6e6a63' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f3f0ea' }] },
  { elementType: 'labels.icon', stylers: [{ saturation: -100 }, { lightness: 20 }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#d6d0c5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d6d0c5' }] },
  { featureType: 'poi', stylers: [{ visibility: 'simplified' }, { saturation: -100 }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#ede9e1' }] },
];

function MapStatus({ children }: Readonly<{ children: string }>) {
  return (
    <div className="flex h-full items-center justify-center bg-paper-2">
      <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">{children}</span>
    </div>
  );
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <MapStatus>Loading map…</MapStatus>;
    case Status.FAILURE:
      return <MapStatus>Error loading map</MapStatus>;
    default:
      return <></>;
  }
};

const MapComponent = ({ zoom }: Readonly<{ zoom: number }>) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new globalThis.google.maps.Map(mapRef.current, {
      center: STUDIO_POSITION,
      zoom,
      disableDefaultUI: true,
      zoomControl: true,
      styles: GRAYSCALE_STYLES,
    });

    const marker = new globalThis.google.maps.Marker({
      position: STUDIO_POSITION,
      map,
      title: "U+ Studio",
    });

    return () => {
      marker.setMap(null);
    };
  }, [zoom]);

  return <div ref={mapRef} className="h-full w-full" />;
};

export default function GoogleMap({ address, height, zoom }: Readonly<GoogleMapProps>) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div style={{ height }} className="relative flex flex-col justify-between border border-line bg-paper-2 p-6">
        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">Map</span>
        <p className="max-w-sm text-[17px] leading-relaxed text-ink">{address}</p>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start border-b border-ink/40 pb-1 text-[15px] text-ink transition-colors hover:border-clay hover:text-clay"
        >
          Open in Google Maps ↗
        </a>
      </div>
    );
  }

  return (
    <div style={{ height }} className="overflow-hidden border border-line">
      <Wrapper apiKey={apiKey} render={render} libraries={['places']}>
        <MapComponent zoom={zoom} />
      </Wrapper>
    </div>
  );
}
