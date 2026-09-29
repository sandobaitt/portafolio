import './HoopShot.css';

// Tiro al aro del cierre. Se usa solo en Contacto (Contact.jsx), que es la
// sección donde se encesta: el tiro termina en "Escribime".
//
// Todo es SVG decorativo. La animación es CSS atada al scroll (HoopShot.css);
// sin soporte o con movimiento reducido se ve la pelota ya adentro de la red.
//
// Coordenadas en el viewBox (600 × 260): la pelota sale del piso a la
// izquierda (x 62) y entra en el aro, centrado en x 510, y 110.

const HoopShot = () => (
  <div className="shot" aria-hidden="true" data-scrub="">
    <svg className="shot-svg" viewBox="0 0 600 260" focusable="false">
      {/* Piso */}
      <line className="shot-line shot-floor" x1="0" y1="252" x2="600" y2="252" />

      {/* Poste, brazo, tablero de perfil y soporte del aro */}
      <path className="shot-line" d="M588 252 V74 H562" />
      <rect className="shot-board" x="552" y="36" width="10" height="86" rx="2" />
      <path className="shot-line" d="M552 110 H538" />

      {/* Mitad de atrás del aro: la pelota pasa por delante */}
      <path className="shot-rim" d="M480 110 A30 7 0 0 1 540 110" />

      {/* Pelota: posición horizontal, vertical, estiramiento y giro por separado */}
      <g className="shot-x">
        <g className="shot-y">
          <g className="shot-squash">
            <g className="shot-spin">
              <circle className="shot-ball" cx="0" cy="0" r="17" />
              <path
                className="shot-seam"
                d="M0 -17 V17 M-17 0 H17 M-12 -12 C-5 -5 -5 5 -12 12 M12 -12 C5 -5 5 5 12 12"
              />
            </g>
          </g>
        </g>
      </g>

      {/* Red: se sacude al encestar */}
      <g className="shot-net">
        <path d="M482 112 L494 160 M494 114 L500 160 M506 115 L506 160 M518 114 L512 160 M530 112 L518 160 M538 110 L524 160" />
        <path d="M486 128 Q506 134 534 128 M490 144 Q506 149 528 144 M494 160 H524" />
      </g>

      {/* Mitad de adelante del aro: tapa a la pelota cuando entra */}
      <path className="shot-rim" d="M480 110 A30 7 0 0 0 540 110" />

      {/* Destello y SWISH */}
      <g className="shot-flash">
        <path d="M510 58 V46 M466 76 L457 68 M554 76 L563 68 M450 108 H438 M570 108 H582" />
      </g>
      <text className="shot-swish" x="366" y="44">
        SWISH
      </text>
    </svg>
  </div>
);

export default HoopShot;
