import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import ApartmentCard from '@/components/ApartmentCard';
import About from '@/components/About';
import ValueProps from '@/components/ValueProps';
import Amenities from '@/components/Amenities';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import LocalAttractions from '@/components/LocalAttractions';
import MapSection from '@/components/MapSection';
import InstagramFeed from '@/components/InstagramFeed';
import PropertyManagement from '@/components/PropertyManagement';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ContactForm />
      <ApartmentCard />
      <About />
      <ValueProps />
      <Amenities />
      <Testimonials />
      <FAQ />
      <LocalAttractions />
      <MapSection />
      <InstagramFeed />
      <PropertyManagement />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
