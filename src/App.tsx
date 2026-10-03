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
        <section id="inicio"><Hero /></section>
        <section id="sobre-mi"><AboutMe /></section>
        <section id="habilidades"><Skills /></section>
        <section id="contenido"><ContentReels /></section>
        <section id="equipo"><Gear /></section>
        <section id="marcas"><Brands /></section>
        <section id="audiencia"><Metrics /></section>
        <section id="paquetes"><Packages /></section>
        <section id="contacto"><Contact /></section>
      </main>
      <Footer />
    </I18nProvider>
  );
}
