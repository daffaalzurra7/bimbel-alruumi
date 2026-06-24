import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import VisiMisiSection from "@/components/landing/VisiMisiSection";
import ProgramSection from "@/components/landing/ProgramSection";
import KeunggulanSection from "@/components/landing/KeunggulanSection";
import AturanSection from "@/components/landing/AturanSection";
import FooterSection from "@/components/landing/FooterSection";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <VisiMisiSection />
        <ProgramSection />
        <KeunggulanSection />
        <AturanSection />
      </main>
      <FooterSection />
      <FloatingWhatsApp />
    </>
  );
}
