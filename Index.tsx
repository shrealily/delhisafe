import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SafetyAreas from "@/components/SafetyAreas";
import EmergencyServices from "@/components/EmergencyServices";
import SafetyTips from "@/components/SafetyTips";
import { EmergencyContactManager } from "@/components/EmergencyContactManager";
import { LocationTracker } from "@/components/LocationTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, UserPlus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [setupComplete, setSetupComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        checkSetupStatus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        checkSetupStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkSetupStatus = async (userId) => {
    // Check if location permission is granted
    if (navigator.geolocation && navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(permissionStatus.state === 'granted');
        
        // Check emergency contacts
        const { data } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('user_id', userId);
        
        setEmergencyContacts(data || []);
        
        if (permissionStatus.state === 'granted' && data && data.length >= 2) {
          setSetupComplete(true);
        }
      } catch (error) {
        console.error('Error checking setup status:', error);
      }
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission(true);
          toast.success("Location access granted!");
        },
        (error) => {
          toast.error("Location access denied. Please enable location in your browser settings.");
          console.error("Location error:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleContactsUpdate = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id);
    
    setEmergencyContacts(data || []);
    
    if (data && data.length >= 2 && locationPermission) {
      setSetupComplete(true);
    }
  };

  if (!user) return null;

  // Show onboarding if not complete
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
        <Header />
        <div className="container mx-auto max-w-2xl mt-20 space-y-6">
          {/* Location Permission */}
          <Card className={locationPermission ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                Step 1: Enable Location Access
              </CardTitle>
              <CardDescription>
                We need your location to track if you're in a danger zone
              </CardDescription>
            </CardHeader>
            <CardContent>
              {locationPermission ? (
                <div className="flex items-center gap-2 text-primary">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Location access granted ✓</span>
                </div>
              ) : (
                <Button onClick={requestLocationPermission} className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Grant Location Permission
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className={emergencyContacts.length >= 2 ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-6 w-6" />
                Step 2: Add Emergency Contacts
              </CardTitle>
              <CardDescription>
                Add at least 2 contacts who will be notified if you're in danger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">
                    Contacts added: {emergencyContacts.length} / 2
                  </span>
                </div>
              </div>
              <EmergencyContactManager onUpdate={handleContactsUpdate} />
            </CardContent>
          </Card>

          {locationPermission && emergencyContacts.length >= 2 && (
            <Card className="border-primary">
              <CardContent className="pt-6">
                <Button onClick={() => setSetupComplete(true)} className="w-full" size="lg">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Start Safety Tracking
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section className="py-12 px-4 bg-secondary/10">
          <div className="container mx-auto max-w-4xl grid md:grid-cols-2 gap-6">
            <LocationTracker />
            <EmergencyContactManager />
          </div>
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
