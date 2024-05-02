import {
  MapContainer,
  Marker,
  Popup,
  TileLayer
} from "react-leaflet";
import { Icon, LatLngTuple, divIcon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { defaultLocation } from "@/constants";

interface MapProps {
  className?: string;
  zoom: number;
  markers?: {
    position: number[];
    popup: string;
    status: string;
  }[];
}

const Map: React.FC<MapProps> = ({ className, zoom, markers }) => {
  const customIcon = new Icon({
    iconUrl: "/images/markerIcon.png",
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
  const customIconDanger = new Icon({
    iconUrl: "/images/markerIconDanger.png",
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
  const createCustomClusterIcon = (cluster: any) => {
    return divIcon({
      html: `<div><p>${cluster.getChildCount()}</p></div>`,
      iconSize: [30,30],
      className: "bg-green-600 rounded-full flex justify-center items-center text-white font-bold text-xl pl-[10px] pt-[2.5px]"
    });
  }
  const [center, setCenter] = useState<number[]>(defaultLocation);
  const [rerender, setRerender] = useState(false);
  useEffect(() => {
    if (markers) {
      if (markers?.length === 0) {
        setCenter(defaultLocation)
        return;
      } else {
        for (let i = 0; i < markers.length; i++) {
          if (markers[i].status !== "normal") {
            setCenter([markers[i].position[0], markers[i].position[1]]);
            return
          }
        }
      }
    } else {
      setCenter(defaultLocation)
      return;
    }
    setCenter([markers[0].position[0], markers[0].position[1]]);
    setRerender(prev => !prev);
  },[markers?.length]);
  return (
    <MapContainer
    key={rerender.toString()}
    center={center as LatLngTuple}
    zoom={zoom}
    className={`w-[95vw] h-[50vh] mx-auto mb-5 rounded-3xl rounded-br-none ${className}`} >
      <TileLayer
        url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
      >
        {markers && markers.map(({ position, popup, status }) => {
          return <Marker key={position.toString()} position={position as LatLngTuple} icon={status == "normal" ? customIcon : customIconDanger}>
            <Popup>{popup}</Popup>
          </Marker>
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;