import TopBar from './components/TopBar';
import Hero from './components/Hero';
import Sites from './components/Sites';
import Repulsor from './components/Repulsor';
import Machine from './components/Machine';
import About from './components/About';
import GithubActivity from './components/GithubActivity';
import Contact from './components/Contact';
import { sections } from './content';
import { useScrollSections } from './hooks/useScrollSections';

const ids = sections.map((s) => s.id);

function App() {
  const { active, ground } = useScrollSections(ids);

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <TopBar active={active} ground={ground} />
      <main id="contenido">
        <Hero />
        <Sites />
        <Repulsor />
        <Machine />
        <About />
        <GithubActivity />
        <Contact />
      </main>
    </>
  );
}

export default App;
