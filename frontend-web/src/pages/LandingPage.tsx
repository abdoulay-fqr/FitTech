import React from 'react'
import HeroSection from '../components/landingpageComponents/HeroSection'
import Navbar from '../components/Navbar'
import ServicesSection from '../components/landingpageComponents/ServicesSection'
import GymAreaSection from '../components/landingpageComponents/GymAreaSection'
import PlansSection from '../components/landingpageComponents/PlansSection'
import CoachsSection from '../components/landingpageComponents/CoachsSection'
import ReviewsSection from '../components/landingpageComponents/ReviewsSection'
import ContactSection from '../components/landingpageComponents/ContactSection'

const LandingPage = () => {
  return (
    <div>

        <Navbar/>
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-full w-[180px] sm:w-[230px] md:w-[300px] lg:w-[430px] bg-[#F7D211]/20 blur-3xl rounded-full" />
      </div>
      <HeroSection/>
      <ServicesSection/>
      <GymAreaSection/>
      <PlansSection/>
      <CoachsSection/>
      <ReviewsSection/>
      <ContactSection/>


    </div>
  )
}

export default LandingPage
