"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Brands",
    description: "Logos, identities & brand systems that make you unforgettable.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#D4AF37" strokeWidth="1" className="w-10 h-10 md:w-12 md:h-12">
        <polygon points="32,4 60,32 32,60 4,32" />
        <polygon points="32,14 50,32 32,50 14,32" />
        <circle cx="32" cy="32" r="4" fill="#D4AF37" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Websites & Apps",
    description: "Beautiful, fast, modern — built to make your business stand out.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#D4AF37" strokeWidth="1" className="w-10 h-10 md:w-12 md:h-12">
        <rect x="8" y="8" width="48" height="48" rx="2" />
        <line x1="8" y1="20" x2="56" y2="20" />
        <rect x="16" y="28" width="14" height="20" rx="1" />
        <line x1="38" y1="28" x2="50" y2="28" />
        <line x1="38" y1="36" x2="50" y2="36" />
        <line x1="38" y1="44" x2="46" y2="44" />
      </svg>
    ),
  },
  {
    title: "AI Systems",
    description: "Smart automations that save you time and stay ahead.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#D4AF37" strokeWidth="1" className="w-10 h-10 md:w-12 md:h-12">
        <circle cx="32" cy="32" r="8" />
        <circle cx="32" cy="32" r="20" />
        <circle cx="32" cy="12" r="3" fill="#D4AF37" opacity="0.4" />
        <circle cx="32" cy="52" r="3" fill="#D4AF37" opacity="0.4" />
        <circle cx="12" cy="32" r="3" fill="#D4AF37" opacity="0.4" />
        <circle cx="52" cy="32" r="3" fill="#D4AF37" opacity="0.4" />
        <line x1="32" y1="15" x2="32" y2="24" />
        <line x1="32" y1="40" x2="32" y2="49" />
        <line x1="15" y1="32" x2="24" y2="32" />
        <line x1="40" y1="32" x2="49" y2="32" />
      </svg>
    ),
  },
  {
    title: "Decentralized Systems",
    description: "Secure, decentralized solutions built to last.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#D4AF37" strokeWidth="1" className="w-10 h-10 md:w-12 md:h-12">
        <rect x="22" y="4" width="20" height="16" rx="2" />
        <rect x="22" y="24" width="20" height="16" rx="2" />
        <rect x="22" y="44" width="20" height="16" rx="2" />
        <line x1="32" y1="20" x2="32" y2="24" />
        <line x1="32" y1="40" x2="32" y2="44" />
        <line x1="22" y1="32" x2="10" y2="32" />
        <line x1="42" y1="32" x2="54" y2="32" />
        <circle cx="10" cy="32" r="3" fill="#D4AF37" opacity="0.4" />
        <circle cx="54" cy="32" r="3" fill="#D4AF37" opacity="0.4" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

export default function ServiceTeaser() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20"
    >
      {/* Section divider */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center gap-6 mb-16"
      >
        <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
        <p className="text-[10px] md:text-xs font-[var(--font-mono)] text-[#D4AF37] tracking-[0.4em] uppercase">
          What We Architect
        </p>
        <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
      </motion.div>

      {/* Service grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {services.map((service) => (
          <motion.div
            key={service.title}
            variants={itemVariants}
            className="flex flex-col items-center text-center group cursor-default"
          >
            <div className="mb-4 p-4 border border-[#D4AF37]/20 rounded-sm group-hover:border-[#D4AF37]/50 transition-colors duration-500">
              {service.icon}
            </div>
            <h4 className="text-xs md:text-sm font-[var(--font-cinzel)] text-white tracking-[0.2em] uppercase mb-2">
              {service.title}
            </h4>
            <p className="text-[10px] md:text-xs font-[var(--font-mono)] text-[#C0C0C0]/70 leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
