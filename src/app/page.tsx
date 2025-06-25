import Header from "@/app/_components/Header";
import Image from "next/image";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div className="md:px-16 lg:px-24 xl:px-36">
      <Header />
      <Hero/>
    </div>
  );
}
