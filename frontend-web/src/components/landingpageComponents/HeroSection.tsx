import { motion } from "framer-motion";
import heroImg from "../../assets/heroimage.png";
import avatar1 from "../../assets/avatar1.png";

const HeroSection = () => {
  return (
    <section
      id="home"
      className=" relative overflow-hidden px-4 sm:px-6 md:px-10 lg:px-20 pt-8 sm:pt-10 md:pt-14 lg:pt-16 pb-10"
    >
     
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="flex justify-center">
          <div className="relative inline-block">
            <div className="relative flex justify-center">
              <div className="relative inline-block">
                
                <motion.p 
                  className="text-[#24292D] font-bold md:font-semibold text-base text-[10px]    sm:text-[12px] md:text-[14px] leading-tight text-left"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Shape Your Body, Boost Your
                </motion.p>

                <motion.h1 
                  className="text-[#1D2125] font-black uppercase leading-[0.88] text-[52px] sm:text-[78px] md:text-[110px] lg:text-[170px] xl:text-[180px] whitespace-nowrap"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="inline-block tracking-[6px] sm:tracking-[10px] md:tracking-[16px] lg:tracking-[31px]">
                    FITN&nbsp;
                  </span>

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

            <motion.div 
                className="mt-10 sm:mt-16 md:mt-0   flex flex-col  md:flex-row pt-[20px] text-[12px]  sm:text-[12px] md:text-[14px]  justify-between items-center lg:items-start gap-6 w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <div className="max-w-[300px]  lg:max-w-[500px]">
                <p className="text-[#3E4348] sm:text-center md:text-left  ">
                 Struggling with strength, endurance, weight loss, <br /> or muscle-building goals? Our expert coaching <br /> provides personalized plans for real, lasting progress.
                </p>
              </div>

              <motion.div 
                className="shrink-0 text-center  lg:text-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                <p className="text-[#1D2125] font-semibold text-base text-[12px]  sm:text-[12px] md:text-[14px] leading-tight">
                  5,000+ Successful
                  <br />
                  Makeovers
                </p>

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