"use client";
import Image from "next/image";
import { Mail, Github, Linkedin, X } from "lucide-react";

export default function Contact() {
  const developers = [
    {
      name: "Aditya Pattanayak",
      role: "Full Stack Developer",
      image: "/images/AdityaP.png",
      description:
        "Led UI/UX redesign, implemented XMTP messaging integration, managed database fetch operations, and built core functionalities including the split logic. Passionate about creating intuitive user experiences and robust backend systems.",
      skills: [
        "React/Next.js",
        "UI/UX Design",
        "Database Management",
        "XMTP Integration",
      ],
      social: {
        github: "https://github.com/AdityaP700",
        linkedin: "https://www.linkedin.com/in/aditya-pattanayak-6b303b267/",
        twitter: "https://x.com/AdityaPat_",
      },
    },
    {
      name: "Vidip Ghosh",
      role: "Full Stack Developer",
      image: "/images/Vidip.png",
      description:
        "Designed and deployed the smart contract, proposed the core idea, and implemented Coinbase Wallet integration and initial frontend development. Expert in blockchain technologies and smart contract development.",
      skills: [
        "Smart Contracts",
        "Blockchain",
        "Coinbase Integration",
        "Frontend Development",
      ],
      social: {
        github: "https://github.com/ghoshvidip26",
        linkedin: "https://www.linkedin.com/in/ghoshvidip26/",
        twitter: "https://x.com/ghoshvidip26",
      },
    },
  ];

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex items-center gap-3 mb-12 justify-center">
        <Mail className="w-8 h-8 text-[#0070f3]" />
        <h1 className="text-4xl font-bold text-[#0070f3]">Contact</h1>
      </div>

      {/* Development Team Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-[#00d4aa] text-center">
          Meet Our Savy Tech Team
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-[#0070f3]/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#0070f3]/10"
            >
              {/* Profile Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={dev.image}
                  alt={dev.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      dev.name
                    )}&size=320&background=random`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Floating Social Links */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <a
                    href={dev.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4 text-gray-800" />
                  </a>
                  <a
                    href={dev.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                  </a>
                  <a
                    href={dev.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110"
                    title="X (Twitter)"
                  >
                    <X className="w-4 h-4 text-gray-800" />
                  </a>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {dev.name}
                  </h3>
                  <p className="text-[#0070f3] font-medium">{dev.role}</p>
                </div>

                {/* <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {dev.description}
                </p> */}

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {dev.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-gradient-to-r from-[#0070f3]/10 to-[#00d4aa]/10 text-[#0070f3] dark:text-[#00d4aa] text-xs font-medium rounded-full border border-[#0070f3]/20 dark:border-[#00d4aa]/20 hover:border-[#0070f3]/40 dark:hover:border-[#00d4aa]/40 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other Sections */}
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Technical Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-[#00d4aa]">
              Technical Support
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              For technical issues, bug reports, or integration questions,
              please reach out through our support channels. We're committed to
              helping you get the most out of SplitMate.
            </p>
          </div>

          {/* Business Inquiries */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-[#00d4aa]">
              Business Inquiries
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              Interested in partnerships, integrations, or business
              opportunities? We'd love to hear from you.
            </p>
          </div>

          {/* Feedback */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-[#00d4aa]">
              Feedback
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              Your feedback helps us improve SplitMate. Share your thoughts,
              suggestions, and feature requests - we read every message and use
              your input to guide our development roadmap.
            </p>
          </div>

          {/* Contributing */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-[#00d4aa]">
              Contributing
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              SplitMate is open to community contributions. Check our GitHub
              repository for contribution guidelines and current development
              needs.
            </p>
          </div>
        </div>

        {/* Response Time */}
        <div className="mt-8 bg-gradient-to-r from-[#0070f3]/10 to-[#00d4aa]/10 rounded-xl p-6 border border-[#0070f3]/20">
          <h2 className="text-xl font-semibold mb-3 text-[#00d4aa]">
            Response Time
          </h2>
          <p className="text-gray-700 dark:text-gray-200">
            We typically respond to all inquiries within 24-48 hours during
            business days.
          </p>
        </div>
      </div>
    </main>
  );
}
