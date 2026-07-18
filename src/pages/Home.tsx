import { Backdrop } from '@/components/site/Backdrop'
import { Navbar } from '@/components/site/Navbar'
import { Hero } from '@/components/site/Hero'
import { Features } from '@/components/site/Features'
import { Architecture } from '@/components/site/Architecture'
import { Pressure } from '@/components/site/Pressure'
import { Docs } from '@/components/site/Docs'
import { Faq } from '@/components/site/Faq'
import { Footer } from '@/components/site/Footer'

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans text-foreground">
      <Backdrop />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Architecture />
          <Pressure />
          <Docs />
          <Faq />
        </main>
        <Footer />
      </div>
    </div>
  )
}
