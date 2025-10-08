import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SafetyAreas from "@/components/SafetyAreas";
import EmergencyServices from "@/components/EmergencyServices";
import SafetyTips from "@/components/SafetyTips";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="safety-map">
          <SafetyAreas />
        </section>
        <section id="services">
          <EmergencyServices />
          <SafetyTips />
        </section>
        <section id="about" className="py-20 px-4 bg-secondary/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold mb-6 text-center">About SafeDelhi</h2>
            <div className="space-y-6 text-lg">
              <p>
                SafeDelhi is a comprehensive crime safety platform designed to help residents and visitors navigate Delhi safely. Our mission is to provide real-time safety information, emergency services access, and peace of mind through innovative technology.
              </p>
              <p>
                With detailed safety ratings for different areas, live location tracking in danger zones, automatic SOS alerts to emergency contacts, and quick access to nearby police stations and hospitals, we're committed to making Delhi safer for everyone.
              </p>
              <p>
                Built with love during our hackathon journey, SafeDelhi combines real-time data, community insights, and emergency response systems to create a safer Delhi experience.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

