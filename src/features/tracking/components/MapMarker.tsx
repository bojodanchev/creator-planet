interface MapMarkerProps {
  coordinates: [number, number]
  color: 'primary' | 'accent'
  index: number
  onMouseEnter: (e: React.MouseEvent<SVGGElement>) => void
  onMouseLeave: () => void
}

const MapMarker: React.FC<MapMarkerProps> = ({ color, index, onMouseEnter, onMouseLeave }) => {
  const fillColor = color === 'primary' ? '#FAFAFA' : '#22C55E';
  const animDelay = `${index * 0.05}s`;
  const animDuration = `${1.5 + (index % 5) * 0.25}s`;

  return (
    <g onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ cursor: 'pointer' }}>
      {/* Pulsing ring */}
      <circle
        r={4}
        fill="none"
        stroke={fillColor}
        strokeWidth={1}
        opacity={0.8}
        style={{
          animation: `marker-ping ${animDuration} ease-out infinite`,
          animationDelay: animDelay,
        }}
      />
      {/* Solid dot */}
      <circle
        r={4}
        fill={fillColor}
        style={{
          filter: `drop-shadow(0 0 6px ${fillColor})`,
        }}
      />
      {/* Invisible hit area */}
      <circle r={12} fill="transparent" />
    </g>
  );
};

export default MapMarker;
