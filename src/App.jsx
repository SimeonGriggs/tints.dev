import React, { useState } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import Form from './components/Form.jsx';
import Palettes from './components/Palettes.jsx';
import DistributionGraph from './components/DistributionGraph.jsx';
import SquareGraph from './components/SquareGraph.jsx';
import Output from './components/Output.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const [palettes, setPalettes] = useState({});

  const [tweaks, setTweaks] = useState({
    name: 'green',
    hex: '#28C76F',
    h: 0,
    hScale: 0,
    s: 0,
    sScale: 0,
    lMax: 97,
    lMin: 10,
    dist: 'lightness',
  });

  const useLightness = tweaks.dist === 'lightness';

  let labels = {
    name: 'Name',
    hex: 'Hex',
    h: 'Hue',
    s: 'Saturation',
    lMin: useLightness ? 'Lightness Min' : 'Luminance Min',
    lMax: useLightness ? 'Lightness Max' : 'Luminance Max',
  };

  return (
    <div className="text-current-900">
      <Header />
      <main className="px-4 md:px-8 md:py-12 lg:w-2/3">
        <Form
          setPalettes={setPalettes}
          palettes={palettes}
          setTweaks={setTweaks}
          tweaks={tweaks}
          labels={labels}
        />
        <Palettes palettes={palettes} />
        <DistributionGraph palettes={palettes} useLightness={useLightness} />

        <div className="flex w-full my-8 space-x-4">
          <SquareGraph
            graph="h"
            labels={labels}
            palettes={palettes}
            useLightness={useLightness}
          />
          <SquareGraph
            graph="s"
            labels={labels}
            palettes={palettes}
            useLightness={useLightness}
          />
        </div>

        <Output palettes={palettes} />
        <Footer />
      </main>
    </div>
  );
}

export default App;
