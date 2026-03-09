// ReviewsSection.tsx
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import ReviewCard from "./ReviewCard";
import avatar1 from "../../assets/avatar1.png";

const reviews = [
  {
    username: "Kim June",
    profilePicture: avatar1,
    text: "Our timetable offers a wide range of low to high intensity fitness programmes to suit your fitness lifestyle.",
    rate: 4,
  },
  {
    username: "Assuyuti",
    profilePicture: avatar1,
    text: "Our timetable offers a wide range of low to high intensity fitness programmes to suit your fitness lifestyle.",
    rate: 3,
  },
  {
    username: "Baskey Koer",
    profilePicture: avatar1,
    text: "Our timetable offers a wide range of low to high intensity fitness programmes to suit your fitness lifestyle.",
    rate: 5,
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
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

const ReviewsSection = () => {
  return (
    <section className="px-6 md:px-10 lg:px-20 pb-12">

      {/* Titre */}
      <motion.h2
        className="flex justify-center items-center text-[24px] md:text-[28px] lg:text-[36px] font-semibold mb-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Past&nbsp;<span className="text-[#F7D211]">Reviews</span>
      </motion.h2>

      {/* Ligne décorative */}
      <motion.div
        className="mx-auto mb-16 h-[3px] bg-[#F7D211] rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: "80px" }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <ReviewCard
              username={review.username}
              profilePicture={review.profilePicture}
              text={review.text}
              rate={review.rate}
            />
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default ReviewsSection;