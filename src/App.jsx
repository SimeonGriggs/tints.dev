import React, { useState } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import Form from './components/Form.jsx';
import Palettes from './components/Palettes.jsx';
import LightnessGraph from './components/LightnessGraph.jsx';
import SquareGraph from './components/SquareGraph.jsx';
import Output from './components/Output.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const [palettes, setPalettes] = useState({});
  const [labels, setLabels] = useState({
    name: 'Name',
    hex: 'Hex',
    h: 'Hue',
    s: 'Saturation',
    lMin: 'Lightness Min',
    lMax: 'Lightness Max',
  });

  return (
    <div className="text-current-900">
      <Header />
      <main className="px-4 md:px-8 md:py-12 lg:w-2/3">
        <Form setPalettes={setPalettes} palettes={palettes} labels={labels} />
        <Palettes palettes={palettes} />
        <LightnessGraph palettes={palettes} />

        <div className="flex w-full my-8 space-x-4">
          <SquareGraph graph="h" labels={labels} palettes={palettes} />
          <SquareGraph graph="s" labels={labels} palettes={palettes} />
        </div>

        <Output palettes={palettes} />
        <Footer />
      </main>
    </div>
  );
}

export default App;
