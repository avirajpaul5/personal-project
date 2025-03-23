import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, XSquare } from "lucide-react";

/** Define the shape of a project */
interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  liveDemo: string;
  github: string;
}

/** Sample projects array */
const projects: Project[] = [
  {
    id: 1,
    title: "Project One",
    description: "An amazing project built using Next.js and Tailwind CSS.",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript"],
    liveDemo: "https://example.com",
    github: "https://github.com/yourrepo/project-one",
  },
  {
    id: 2,
    title: "Project Two",
    description: "Another fantastic project showcasing AI capabilities.",
    techStack: ["React", "Python", "OpenAI API"],
    liveDemo: "https://example.com",
    github: "https://github.com/yourrepo/project-two",
  },
  // Add more projects if you like
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="relative min-h-screen bg-gray-900/80 text-white p-6 md:p-10">
      {/* Top "Finder" Title Bar (Optional) */}
      <div className="bg-gray-700/50 rounded-t-md h-10 flex items-center px-4 mb-4">
        <p className="text-sm">Projects</p>
      </div>

      {/* Page Title */}
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Folder size={30} color="#FACC15" />
        <span>My Projects</span>
      </h2>

      {/* Finder-Style Grid of Folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="cursor-pointer flex flex-col items-center justify-center bg-white/10 
                       rounded-md p-6 hover:bg-white/20 transition"
          >
            <Folder size={48} color="#FACC15" className="mb-2" />
            <p className="text-lg font-semibold">{project.title}</p>
          </div>
        ))}
      </div>

      {/* AnimatePresence handles mounting/unmounting of the detail window */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* The Window Container */}
            <motion.div
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                         w-96 max-w-full rounded-lg shadow-2xl p-4 relative"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Title Bar */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedProject.title}</h3>
                <XSquare
                  size={24}
                  className="cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => setSelectedProject(null)}
                />
              </div>

              {/* Project Content */}
              <p className="mb-3">{selectedProject.description}</p>
              <p className="mb-3">
                <strong>Tech Stack:</strong>{" "}
                {selectedProject.techStack.join(", ")}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <a
                  href={selectedProject.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                >
                  Live Demo
                </a>
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-800"
                >
                  GitHub
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
