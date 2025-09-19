import Features from "@/components/ui/Features";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/ui/Hero";
import Navbar from "@/components/ui/Navbar";
import Image from "next/image";

export default function Home() {
  return (
     <section>
      <Navbar/>
      <Hero/>
      <Features/>
      <Footer/>
     </section>
  );
}
