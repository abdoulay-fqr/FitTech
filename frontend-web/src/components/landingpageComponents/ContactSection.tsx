import { motion } from "framer-motion";
import { useState } from "react";
import athleteImg from "../../assets/contactImg.png";

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const ContactSection = () => {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (vals = values) => {
    const newErrors: FormErrors = {};

    if (!vals.name.trim())
      newErrors.name = "Le nom est obligatoire.";

    if (!vals.email.trim())
      newErrors.email = "L'email est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email))
      newErrors.email = "Format email invalide.";

    if (!vals.phone.trim())
      newErrors.phone = "Le numéro est obligatoire.";
    else if (!/^\d{10}$/.test(vals.phone))
      newErrors.phone = "Le numéro doit contenir exactement 10 chiffres.";

    if (!vals.message.trim())
      newErrors.message = "Le message est obligatoire.";

    return newErrors;
  };

  const handleChange = (field: string, value: string) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    if (submitted) {
      setErrors(validate(newValues));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Formulaire soumis :", values);
    }
  };

  const hasErrors = submitted && Object.keys(validate(values)).length > 0;

  return (
    <section id="contact" className="relative pt-14">

      <div className="absolute inset-x-0 bottom-0 h-[450px] bg-[#F7D211]"></div>

      <div className="relative z-10 px-6 md:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 max-w-[1100px] mx-auto">

          {/* Image gauche — cachée sur mobile */}
          <motion.div
            className="hidden md:flex flex-1 justify-center md:justify-start items-end"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src={athleteImg}
              alt="Athlete"
              className="w-[240px] sm:w-[260px] md:w-[350px] lg:w-[400px] object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </motion.div>

          {/* Formulaire */}
          <motion.div
            className="w-full max-w-[440px] mx-auto md:mx-0 md:flex-1 rounded-[14px] bg-[#EBEBEB] p-5 sm:p-6 md:p-7 shadow-[12px_14px_22px_rgba(0,0,0,0.12)]"
            style={{ marginBottom: "30px" }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <h2 className="text-center text-[#111827] text-[24px] md:text-[28px] font-bold">
              Contact Us
            </h2>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>

              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={values.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full rounded-[8px] bg-[#F8F8F8] px-4 py-3 text-[#24292D] outline-none border ${errors.name ? "border-red-500" : "border-transparent"}`}
                />
                {errors.name && <p className="text-red-500 text-[13px] mt-1 ml-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Email Address"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full rounded-[8px] bg-[#F8F8F8] px-4 py-3 text-[#24292D] outline-none border ${errors.email ? "border-red-500" : "border-transparent"}`}
                />
                {errors.email && <p className="text-red-500 text-[13px] mt-1 ml-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={values.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`w-full rounded-[8px] bg-[#F8F8F8] px-4 py-3 text-[#24292D] outline-none border ${errors.phone ? "border-red-500" : "border-transparent"}`}
                />
                {errors.phone && <p className="text-red-500 text-[13px] mt-1 ml-1">{errors.phone}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  value={values.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className={`w-full resize-none rounded-[8px] bg-[#F8F8F8] px-4 py-3 text-[#24292D] outline-none border ${errors.message ? "border-red-500" : "border-transparent"}`}
                />
                {errors.message && <p className="text-red-500 text-[13px] mt-1 ml-1">{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={hasErrors}
                className={`w-full rounded-[6px] py-3 text-white text-[16px] font-medium transition-colors
                  ${hasErrors
                    ? "bg-[#9CA3AF] cursor-not-allowed"
                    : "bg-[#1D2125] cursor-pointer"
                  }`}
                whileHover={hasErrors ? {} : { scale: 1.02 }}
                whileTap={hasErrors ? {} : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Contact Us
              </motion.button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;