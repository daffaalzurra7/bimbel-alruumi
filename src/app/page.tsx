// Landing Page — Server Component
// Fetches CMS content from DB and passes as props to client components

import { getSectionContent, getContentMap } from "@/lib/cms";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import VisiMisiSection from "@/components/landing/VisiMisiSection";
import ProgramSection from "@/components/landing/ProgramSection";
import KeunggulanSection from "@/components/landing/KeunggulanSection";
import AturanSection from "@/components/landing/AturanSection";
import FooterSection from "@/components/landing/FooterSection";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";

export default async function HomePage() {
  // Fetch all sections in parallel
  const [heroEntries, visiMisiEntries, programEntries, keunggulanEntries, aturanEntries, footerEntries] =
    await Promise.all([
      getSectionContent("hero").catch(() => []),
      getSectionContent("visi_misi").catch(() => []),
      getSectionContent("program").catch(() => []),
      getSectionContent("keunggulan").catch(() => []),
      getSectionContent("aturan").catch(() => []),
      getSectionContent("footer").catch(() => []),
    ]);

  const hero = getContentMap(heroEntries);
  const visiMisi = getContentMap(visiMisiEntries);
  const program = getContentMap(programEntries);
  const keunggulan = getContentMap(keunggulanEntries);
  const aturan = getContentMap(aturanEntries);
  const footer = getContentMap(footerEntries);

  // WhatsApp number from hero section (shared with FloatingWhatsApp)
  const waNumber = String(hero.wa_number || "");

  return (
    <>
      <Navbar />
      <main>
        <HeroSection content={hero} />
        <VisiMisiSection content={visiMisi} />
        <ProgramSection content={program} waNumber={waNumber} />
        <KeunggulanSection content={keunggulan} />
        <AturanSection content={aturan} />
      </main>
      <FooterSection content={footer} />
      <FloatingWhatsApp waNumber={waNumber} />
    </>
  );
}
