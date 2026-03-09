import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import CoachCard from "./CoachCard";
import coach1 from "../../assets/coach1.jpg";

const coaches = [
  {
    name: "Sam Adebayo",
    picture: coach1,
    links: {
      linkedin: "https://www.linkedin.com/in/sam-adebayo",
      twitter: "https://twitter.com/sam_adebayo",
      dribbble: "https://dribbble.com/sam_adebayo",
    },
  },
  {
    name: "Sodiq Ogbon",
    picture: coach1,
    links: {
      linkedin: "https://www.linkedin.com/in/sodiq-ogbon",
      twitter: "https://twitter.com/sodiq_ogbon",
      dribbble: "https://dribbble.com/sodiq_ogbon",
    },
  },
  {
    name: "Mc Greg",
    picture: coach1,
    links: {
      linkedin: "https://www.linkedin.com/in/mcgreg",
      twitter: "https://twitter.com/mcgreg",
      dribbble: "https://dribbble.com/mcgreg",
    },
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.25,
      duration: 0.7,
      ease: "easeOut" as const,
    },
  }),
};

const CoachsSection = () => {
  return (
    <section className="px-6 md:px-10 lg:px-20 py-24">

      {/* Title animé au scroll */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="flex justify-center items-center text-[24px] md:text-[28px] lg:text-[36px] font-semibold mb-4">
          Meet <span className="text-[#F7D211]">&nbsp;Our Coachs</span>
        </h2>

        <motion.p
          className="mt-4 text-[#4B4F52] text-[16px] md:text-[18px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Discover The Coaches Who Will Inspire And Guide You Toward Your Fitness Goals
        </motion.p>
      </motion.div>

      {/* Ligne décorative animée */}
      <motion.div
        className="mx-auto mt-6 h-[3px] bg-[#F7D211] rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: "80px" }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      />

      {/* Cards avec stagger au scroll */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
        {coaches.map((coach, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <CoachCard
              picture={coach.picture}
              name={coach.name}
              links={coach.links}
            />
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default CoachsSection;