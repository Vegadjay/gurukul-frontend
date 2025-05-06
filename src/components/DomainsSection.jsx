
import React from "react";
import { Link } from "react-router-dom";
import { Book, Music, Palette } from "lucide-react";

const DomainCard = ({ image, title, description, icon: Icon, link }) => {
  return (
    <Link to={link} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 p-2 rounded-full">
            <Icon className="h-6 w-6 text-guru-blue" />
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </Link>
  );
};

const DomainsSection = () => {
  const domains = [
    {
      id: 1,
      title: "Instruments | Performing",
      description: "Learn musical instruments and performance skills from expert musicians.",
      image: "/863f5fe1-0478-47b4-a7d9-674c47c6bb4b.png",
      icon: Music,
      link: "/domains/music",
    },
    {
      id: 2,
      title: "Art and Creativity",
      description: "Explore artistic expression through various mediums with talented artists.",
      image: "/34e80c9e-a6bf-4ba2-b1b3-1876f65981ae.png",
      icon: Palette,
      link: "/domains/art",
    },
    {
      id: 3,
      title: "Academics",
      description: "Improve your knowledge and grades with specialized academic tutors.",
      image: "/6324c458-2d76-49f9-bb51-58f7e930223a.png",
      icon: Book,
      link: "/domains/academics",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Diverse Domains
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Explore a wide range of subjects taught by passionate experts. Whether you're interested in music, art, or academics, we have the perfect Guru for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domains.map((domain) => (
            <DomainCard key={domain.id} {...domain} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainsSection;
