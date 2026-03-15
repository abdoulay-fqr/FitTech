import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import AreaCard from "./AreaCard";

import strengthImg from "../../assets/strengthImg.jpg";
import cardioImg from "../../assets/cardionimg.jpg";
import yogaImg from "../../assets/yogaimg.jpg";
import poolImg from "../../assets/poolimg.jpg";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

const areas = [
  {
    img: strengthImg,
    title: "Strength",
    text: "Build muscle and enhance power with a variety of free weights, machines, and resistance equipment designed for all fitness levels.",
  },
  {
    img: cardioImg,
    title: "Cardio",
    text: "Boost endurance and burn calories with our selection of treadmills, bikes, ellipticals, and more, perfect for high-energy workouts.",
  },
  {
    img: yogaImg,
    title: "Yoga",
    text: "Find balance and flexibility through calming yoga sessions, designed to improve mobility, reduce stress, and enhance overall wellness.",
  },
  {
    img: poolImg,
    title: "Pool",
    text: "Dive into fitness with our swimming pool, ideal for low-impact exercises, lap swimming, and water aerobics to boost endurance and muscle tone.",
  },
];

const GymAreaSection = () => {
  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-5 md:py-6 lg:py-8">

      <motion.p
        className="flex justify-center items-center text-[24px] md:text-[28px] lg:text-[36px] font-semibold mb-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Explore
        <span className="text-[#F7D211]">&nbsp;Our Gym Areas</span>
      </motion.p>

      {/* Ligne décorative */}
      <motion.div
        className="mx-auto mb-4 h-[2px] bg-[#F7D211] rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: "50px" }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      />

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-4xl mx-auto">
        {areas.map((area, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <AreaCard
              img={area.img}
              title={area.title}
              text={area.text}
            />
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default GymAreaSection;