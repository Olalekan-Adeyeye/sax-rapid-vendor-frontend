"use client";

import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/Input";

export interface GooglePlaceResult {
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

interface GoogleAddressAutocompleteProps {
  country: string | null;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: GooglePlaceResult) => void;
  onDirty?: () => void;
  onGeocodeFailed?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

function restrictionFor(country: string | null): string | undefined {
  if (country === "NG") return "ng";
  if (country === "ZA") return "za";
  return undefined;
}

function countryNameFor(country: string | null): string | null {
  if (country === "NG") return "Nigeria";
  if (country === "ZA") return "South Africa";
  return null;
}

function resultCountry(
  components: google.maps.GeocoderAddressComponent[],
): string | null {
  const found = components.find((c) => c.types.includes("country"));
  return found?.short_name?.toUpperCase() ?? null;
}

function componentText(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
): string {
  return components.find((c) => c.types.includes(type))?.long_name ?? "";
}

function AutocompleteInput({
  country,
  value,
  onChange,
  onPlaceSelected,
  onDirty,
  onGeocodeFailed,
  placeholder = "Start typing your address...",
  disabled = false,
  required = false,
  error,
}: GoogleAddressAutocompleteProps) {
  const places = useMapsLibrary("places");
  const geocoding = useMapsLibrary("geocoding");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [outOfCountry, setOutOfCountry] = useState(false);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  const onDirtyRef = useRef(onDirty);
  const onGeocodeFailedRef = useRef(onGeocodeFailed);
  const committedRef = useRef<string | null>(null);
  useEffect(() => {
    onPlaceSelectedRef.current = onPlaceSelected;
    onDirtyRef.current = onDirty;
    onGeocodeFailedRef.current = onGeocodeFailed;
  });

  const isAllowedCountry = useCallback(
    (components: google.maps.GeocoderAddressComponent[]): boolean => {
      if (!country) return true;
      return resultCountry(components) === country;
    },
    [country],
  );

  const parseResult = (
    components: google.maps.GeocoderAddressComponent[],
    formattedAddress: string | undefined,
    lat: number,
    lng: number,
  ): GooglePlaceResult | null => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const streetNumber = componentText(components, "street_number");
    const route = componentText(components, "route");
    const street = [streetNumber, route].filter(Boolean).join(" ");
    const city =
      componentText(components, "locality") ||
      componentText(components, "administrative_area_level_2") ||
      "";
    const state =
      componentText(components, "administrative_area_level_1") || "";
    return {
      address: street || formattedAddress || "",
      city,
      state,
      lat,
      lng,
    };
  };

  const handleBlur = () => {
    const typed = inputRef.current?.value.trim() ?? "";
    if (!typed || typed === committedRef.current || !geocoding) return;
    const restriction = restrictionFor(country);
    const geocoder = new geocoding.Geocoder();
    geocoder.geocode(
      {
        address: typed,
        ...(restriction
          ? { componentRestrictions: { country: restriction } }
          : {}),
      },
      (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK || !results?.[0]) {
          onGeocodeFailedRef.current?.();
          return;
        }
        const result = results[0];
        const location = result.geometry?.location;
        if (!location) {
          onGeocodeFailedRef.current?.();
          return;
        }
        const components = result.address_components ?? [];
        if (!isAllowedCountry(components)) {
          setOutOfCountry(true);
          return;
        }
        const parsed = parseResult(
          components,
          result.formatted_address,
          location.lat(),
          location.lng(),
        );
        if (!parsed) {
          onGeocodeFailedRef.current?.();
          return;
        }
        committedRef.current = typed;
        setOutOfCountry(false);
        onPlaceSelectedRef.current({ ...parsed, address: typed });
      },
    );
  };

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const restriction = restrictionFor(country);
    const autocomplete = new places.Autocomplete(inputRef.current, {
      types: ["address"],
      ...(restriction
        ? { componentRestrictions: { country: restriction } }
        : {}),
    });
    autocomplete.setFields([
      "address_components",
      "formatted_address",
      "geometry",
    ]);
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      if (!location) return;
      const components = place.address_components ?? [];
      if (!isAllowedCountry(components)) {
        setOutOfCountry(true);
        return;
      }
      const parsed = parseResult(
        components,
        place.formatted_address,
        location.lat(),
        location.lng(),
      );
      if (!parsed || !parsed.address) {
        const fallback = inputRef.current?.value || "";
        if (!fallback || !isAllowedCountry(components)) {
          if (fallback) setOutOfCountry(true);
          return;
        }
        committedRef.current = fallback;
        setOutOfCountry(false);
        onPlaceSelectedRef.current({
          address: fallback,
          city: "",
          state: "",
          lat: location.lat(),
          lng: location.lng(),
        });
        return;
      }
      committedRef.current = parsed.address;
      setOutOfCountry(false);
      onPlaceSelectedRef.current(parsed);
    });
    return () => listener.remove();
  }, [places, country, isAllowedCountry]);

  const countryName = countryNameFor(country);

  return (
    <div className="space-y-2">
      <Input
        label="Address"
        id="google-address-autocomplete"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setOutOfCountry(false);
          if (
            committedRef.current !== null &&
            e.target.value !== committedRef.current
          ) {
            committedRef.current = null;
            onDirtyRef.current?.();
          }
          onChange(e.target.value);
        }}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        error={error}
        autoComplete="off"
        ref={inputRef}
        className="h-12 lg:h-14 rounded"
      />
      {outOfCountry && countryName && (
        <p className="text-[11px] font-bold text-red-500">
          Please choose a location within {countryName}. Out-of-country
          addresses are not accepted.
        </p>
      )}
    </div>
  );
}

export function GoogleAddressAutocomplete(
  props: GoogleAddressAutocompleteProps,
) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const autoRetried = useRef(false);

  useEffect(() => {
    if (!loadFailed || autoRetried.current) return;
    autoRetried.current = true;
    const timer = setTimeout(() => {
      setLoadFailed(false);
      setAttempt((a) => a + 1);
    }, 3000);
    return () => clearTimeout(timer);
  }, [loadFailed]);

  const handleRetry = () => {
    setLoadFailed(false);
    setAttempt((a) => a + 1);
  };

  if (!apiKey || loadFailed) {
    const { value, onChange, onDirty, placeholder, disabled, required, error } =
      props;
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          {loadFailed
            ? "Google Maps could not load — your network is blocking maps.googleapis.com (ad-blocker, firewall, or ISP). Type your address manually and fill City / State below."
            : "Auto-location unavailable — type your address manually."}
        </p>
        {loadFailed && (
          <button
            type="button"
            onClick={handleRetry}
            className="text-[10px] font-black uppercase tracking-widest text-black hover:text-gold transition-colors"
          >
            Retry auto-location
          </button>
        )}
        <Input
          label="Address"
          id="google-address-fallback"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onDirty?.();
            onChange(e.target.value);
          }}
          disabled={disabled}
          required={required}
          error={error}
          className="h-12 lg:h-14 rounded"
        />
      </div>
    );
  }

  return (
    <APIProvider
      key={attempt}
      apiKey={apiKey}
      libraries={["places", "geocoding"]}
      onError={() => setLoadFailed(true)}
    >
      <AutocompleteInput {...props} />
    </APIProvider>
  );
}
