import Header from '../components/layout/Header'
import HeroSection from '../components/home/HeroSection'
import StatsGrid from '../components/home/StatsGrid'
import SearchFilters from '../components/home/SearchFilters'
import VenueList from '../components/home/VenueList'
import WhatsAppFAB from '../components/layout/WhatsAppFAB'
import Footer from '../components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsGrid />
        <SearchFilters />
        <VenueList />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  )
}