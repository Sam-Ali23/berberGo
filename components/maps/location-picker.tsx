"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { formatCoordinates } from "@/lib/format";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
let mapsOptionsInitialized = false;
let mapsOptionsLocale: string | null = null;

export function LocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
}) {
  const t = useTranslations("Map");
  const locale = useLocale();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const handleChange = useEffectEvent(onChange);

  useEffect(() => {
    if (!googleMapsApiKey || !mapContainerRef.current) {
      return;
    }

    let mounted = true;

    async function initializeMap() {
      if (!mapsOptionsInitialized || mapsOptionsLocale !== locale) {
        setOptions({
          key: googleMapsApiKey,
          v: "weekly",
          language: locale,
        });
        mapsOptionsInitialized = true;
        mapsOptionsLocale = locale;
      }

      await importLibrary("maps");

      if (!mounted || !mapContainerRef.current) {
        return;
      }

      const center = {
        lat: latitude ?? 24.7136,
        lng: longitude ?? 46.6753,
      };

      const map = new google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 12,
        disableDefaultUI: true,
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      const marker = new google.maps.Marker({
        map,
        position: center,
      });

      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        const nextLat = event.latLng?.lat();
        const nextLng = event.latLng?.lng();

        if (nextLat == null || nextLng == null) {
          return;
        }

        marker.setPosition({ lat: nextLat, lng: nextLng });
        handleChange(nextLat, nextLng);
      });

      mapRef.current = map;
      markerRef.current = marker;
      setMapReady(true);
    }

    void initializeMap();

    return () => {
      mounted = false;
    };
  }, [latitude, longitude, locale]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || latitude == null || longitude == null) {
      return;
    }

    const position = { lat: latitude, lng: longitude };
    markerRef.current.setPosition(position);
    mapRef.current.panTo(position);
  }, [latitude, longitude]);

  if (!googleMapsApiKey) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
        <div className="text-base font-bold text-slate-900">{t("title")}</div>
        <p className="mt-2 leading-7">
          {t("placeholderPrefix")} <code className="rounded bg-white px-2 py-1">.env.local</code>{" "}
          {t("placeholderMiddle")}{" "}
          <code className="rounded bg-white px-2 py-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          {t("placeholderSuffix")}
        </p>
        <p className="mt-3 font-semibold text-slate-700">
          {t("currentCoordinates", { value: formatCoordinates(latitude, longitude) })}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
        <div ref={mapContainerRef} className="h-72 w-full rounded-[22px]" />
      </div>
      <p className="text-xs text-slate-500">
        {mapReady ? t("clickToSelect") : t("loading")}
      </p>
    </div>
  );
}
