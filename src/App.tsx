import { I18nProvider } from './hooks/useI18n';
import Nav from './components/Nav';
import Hero from './components/sections/Hero';
import AboutMe from './components/sections/AboutMe';
import Skills from './components/sections/Skills';
import ContentReels from './components/sections/ContentReels';
import Gear from './components/sections/Gear';
import Brands from './components/sections/Brands';
import Metrics from './components/sections/Metrics';
import Packages from './components/sections/Packages';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <I18nProvider>
      <Nav />
      <main>
        <Hero />
        <AboutMe />
        <Skills />
        <ContentReels />
        <Gear />
        <Brands />
        <Metrics />
        <Packages />
        <Contact />
      </main>
      <Footer />
    </I18nProvider>
  );
}
