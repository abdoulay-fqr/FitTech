import React from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn, FaDribbble, FaTwitter } from "react-icons/fa";
import type { IconType } from "react-icons";

type CoachCardProps = {
  picture: string;
  name: string;
  links: {
    linkedin: string;
    twitter: string;
    dribbble: string;
  };
};

const CoachCard = ({ picture, name, links }: CoachCardProps) => {
  const renderIcon = (Icon: IconType) => {
    const Component = Icon as unknown as React.FC;
    return <Component />;
  };

  return (
    <motion.div
      className="flex flex-col items-center text-center"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Image */}
      <div className="w-full max-w-[240px] overflow-hidden rounded-[14px]">
        <img
          src={picture}
          alt={name}
          className="w-full h-[220px] object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Name */}
      <h3 className="mt-3 text-[18px] font-semibold text-[#24292D]">{name}</h3>

      {/* Role */}
      <p className="text-[#5C6064] text-[14px]">Coach</p>

      {/* Social icons */}
      <div className="flex gap-3 mt-2 text-[15px] text-[#24292D]">
        <motion.a
          href={links.linkedin}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.3, color: "#0077B5" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {renderIcon(FaLinkedinIn)}
        </motion.a>

        <motion.a
          href={links.twitter}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.3, color: "#1DA1F2" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {renderIcon(FaTwitter)}
        </motion.a>

        <motion.a
          href={links.dribbble}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.3, color: "#EA4C89" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {renderIcon(FaDribbble)}
        </motion.a>
      </div>
    </motion.div>
  );
};

export default CoachCard;