import { motion } from "framer-motion";
import heroImg from "../../assets/heroimage.png";
import avatar1 from "../../assets/avatar1.png";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 sm:px-6 md:px-10 lg:px-20 pt-8 sm:pt-10 md:pt-14 lg:pt-16 pb-10"
    >
     
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="flex justify-center">
          <div className="relative inline-block">
            <div className="relative flex justify-center">
              <div className="relative inline-block">
                
                {/* Shape Your Body, Boost Your - animation */}
                <motion.p 
                  className="text-[#24292D] font-semibold text-base sm:text-lg md:text-2-xl leading-tight text-left"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Shape Your Body, Boost Your
                </motion.p>

                {/* Titre avec image - animation */}
                <motion.h1 
                  className="text-[#1D2125] font-black uppercase leading-[0.88] text-[52px] sm:text-[78px] md:text-[110px] lg:text-[170px] xl:text-[180px] whitespace-nowrap"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="inline-block tracking-[6px] sm:tracking-[10px] md:tracking-[16px] lg:tracking-[31px]">
                    FITN&nbsp;
                  </span>

                  {/* Image avec animation - position exactement comme avant */}
                  <img
                    src={heroImg}
                    alt="fitness"
                    className="
                      pointer-events-none absolute z-20
                      left-1/2 -translate-x-1/3
                      top-[-10px] sm:top-[-18px] md:top-[-28px] lg:top-[-55px] xl:top-[-60px]
                      w-[150px] sm:w-[215px] md:w-[285px] lg:w-[400px] xl:w-[450px]
                    "
                  />
                  
                  <span className="inline-block tracking-[6px] sm:tracking-[10px] md:tracking-[16px] lg:tracking-[31px]">
                    ESS
                  </span>
                </motion.h1>

               
              </div>
            </div>

            {/* Description et stats avec animation */}
            <motion.div 
              className="mt-6 sm:mt-8 flex flex-col md:flex-row lg:justify-between lg:items-start gap-6 w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {/* Description */}
              <div className="max-w-[520px]">
                <p className="text-[#3E4348] text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-left">
                  Struggling With Strength, Endurance, Weight Loss,
                  <br className="hidden sm:block" />
                  Or Muscle-Building Goals? Our Expert Coaching
                  <br className="hidden sm:block" />
                  Provides Personalized Plans For Real, Lasting
                  <br className="hidden sm:block" />
                  Progress.
                </p>
              </div>

              {/* Stats avec avatars */}
              <motion.div 
                className="shrink-0 text-center lg:text-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                <p className="text-[#1D2125] font-semibold text-base sm:text-lg md:text-2xl leading-tight">
                  5,000+ Successful
                  <br />
                  Makeovers
                </p>

                {/* Avatars avec animation individuelle */}
                <div className="mt-3 flex justify-center lg:justify-end">
                  <motion.img
                    src={avatar1}
                    alt="avatar1"
                    className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                  />
                  <motion.img
                    src={avatar1}
                    alt="avatar2"
                    className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-white -ml-3"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.0 }}
                  />
                  <motion.img
                    src={avatar1}
                    alt="avatar3"
                    className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-white -ml-3"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.1 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;