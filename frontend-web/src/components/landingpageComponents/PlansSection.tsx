import { useState } from "react";
import PlanCard from "./PlanCard";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const plans = {
  monthly: [
    {
      type: "Pro Plan",
      text: "Our mm Pro Plan Offers Advanced Workouts And Personalized Nutrition Coaching To Help You Reach Your Goals Faster. Sign Up Right Now!",
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
  ],
  annually: [
    {
      type: "Pro Plan",
      text: "Our yy Pro Plan Offers Advanced Workouts And Personalized Nutrition Coaching To Help You Reach Your Goals Faster. Sign Up Right Now!",
      features: [
        "Access To All Of Our Exercise Videos",
        "Progress Tracking",
        "Supportive Online Community",
        "Advanced, Personalized Workout Plans",
        "Comprehensive Nutrition Coaching",
        "Access To Advanced Workout Programs",
        "Body Composition Analysis",
      ],
      price: 999,
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
      price: 1499,
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
      price: 499,
    },
  ],
};

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
  const [billing, setBilling] = useState<"monthly" | "annually">("monthly");

  return (
    <section
      id="plans"
      className="relative overflow-hidden px-6 md:px-10 lg:px-20 py-6"
    >
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="absolute w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[700px] bg-[#F7D211]/10 blur-[200px] rounded-full" />
        <div className="absolute w-[200px] md:w-[400px] lg:w-[500px] h-[200px] md:h-[400px] lg:h-[300px] bg-[#F7D211]/25 blur-[140px] rounded-full" />
      </div>

      <motion.p
        className="flex justify-center items-center text-[20px] md:text-[24px] lg:text-[28px] font-semibold mb-3"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Choose <span className="text-[#F7D211]">&nbsp;Your Plan</span>
      </motion.p>

      <motion.p
        className="flex justify-center items-center text-[12px] md:text-[13px] lg:text-[14px] mb-4 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
      >
        Select the plan that suits your fitness goals and let our expert coaches guide you every step of the way.
      </motion.p>

      <motion.div
        className="mx-auto mb-5 h-[2px] bg-[#F7D211] rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: "60px" }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
      />

      <div className="relative z-10 flex justify-center mb-6">
        <div className="relative flex w-[280px] h-[44px] rounded-full border border-[#F7D211] bg-white/70 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full w-1/2 rounded-full bg-[#F7D211]"
            animate={{ x: billing === "monthly" ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          />
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`relative z-10 w-1/2 h-full text-[15px] font-semibold transition ${
              billing === "monthly" ? "text-white" : "text-[#F7D211]"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("annually")}
            className={`relative z-10 w-1/2 h-full text-[15px] font-semibold transition ${
              billing === "annually" ? "text-white" : "text-[#F7D211]"
            }`}
          >
            Annually
          </button>
        </div>
      </div>

      {/* Cards */}
      <motion.div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {plans[billing].map((plan, index) => (
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