import { useEffect } from "react";

// La oficina fusionada (personaje robot de este prototipo + despachos y datos reales de SIMBAI)
// vive en public/oficina.html: Three.js sin build. Esta página solo lleva allí.
function Index() {
  useEffect(() => {
    window.location.replace("/oficina.html" + window.location.search);
  }, []);
  return null;
}

export default Index;
