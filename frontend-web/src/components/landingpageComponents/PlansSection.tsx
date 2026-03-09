import PlanCard from "./PlanCard";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const plans = [
  {
    type: "Pro Plan",
    text: "Our Pro Plan Offers Advanced Workouts And Personalized Nutrition Coaching To Help You Reach Your Goals Faster. Sign Up Right Now!",
    features: [
      "Access To All Of Our Exercise Videos",
      "Progress Tracking",
      "Supportive Online Community",
      "Advanced, Personalized Workout Plans",
      "Comprehensive Nutrition Coaching",
      "Access To Advanced Workout Programs",
      "Body Composition Analysis",
    ],
    price: 99,
  },
  {
    type: "Custom Plan",
    text: "Experience A Fully Tailored Fitness Experience With Our Custom Plan. Work One-On-One With A Dedicated Trainer To Achieve Your Goals.",
    features: [
      "Access To All Of Our Exercise Videos",
      "Progress Tracking",
      "Supportive Online Community",
      "Fully Customized Workout And Nutrition Plan",
      "Weekly Check-Ins With Your Trainer",
      "Access To All Platform Features",
      "Exclusive Gear Discounts",
    ],
    price: 149,
  },
  {
    type: "Beginner Plan",
    text: "Start Your Fitness Journey With Our Beginner Plan. Build A Strong Foundation With Basic Workouts And Essential Nutrition Guidance.",
    features: [
      "Access To All Of Our Exercise Videos",
      "Progress Tracking",
      "Supportive Online Community",
      "Personalized Workout Plans",
      "Basic Nutrition Guidance",
      "Access To Group Fitness Classes",
    ],
    price: 49,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

const PlansSection = () => {
  return (
    <section
      id="plans"
      className="relative overflow-hidden px-6 md:px-10 lg:px-20 py-10"
    >
      {/* Yellow glow background */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="absolute w-[500px] md:w-[800px] lg:w-[1000px] h-[500px] md:h-[800px] lg:h-[900px] bg-[#F7D211]/10 blur-[200px] rounded-full" />
        <div className="absolute w-[300px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[500px] lg:h-[400px] bg-[#F7D211]/25 blur-[140px] rounded-full" />
      </div>

      {/* Titre animé au scroll */}
      <motion.p
        className="flex justify-center items-center text-[24px] md:text-[28px] lg:text-[36px] font-semibold mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Choose <span className="text-[#F7D211]">&nbsp;Your Plan</span>
      </motion.p>

      {/* Sous-titre animé au scroll */}
      <motion.p
        className="flex justify-center items-center text-[12px] md:text-[14px] lg:text-[16px] mb-6 lg:mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
      >
        Select the plan that suits your fitness goals and let our expert coaches guide you every step of the way.
      </motion.p>

      {/* Ligne décorative animée */}
      <motion.div
        className="mx-auto mb-10 h-[3px] bg-[#F7D211] rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: "80px" }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
      />

      {/* Cards */}
      <motion.div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {plans.map((plan, index) => (
          <motion.div key={index} variants={cardVariants}>
            <PlanCard
              type={plan.type}
              text={plan.text}
              features={plan.features}
              price={plan.price}
            />
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
};

export default PlansSection;