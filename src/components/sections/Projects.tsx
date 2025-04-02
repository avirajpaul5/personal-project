import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, XSquare } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  liveDemo: string;
  github: string;
}

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
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="relative min-h-screen bg-white/90 dark:bg-gray-900/80 p-6 md:p-10">
      {/* Top "Finder" Title Bar */}
      <div className="bg-gray-200/50 dark:bg-gray-700/50 rounded-t-md h-10 flex items-center px-4 mb-4">
        <p className="text-sm dark:text-gray-300">Projects</p>
      </div>

      {/* Page Title */}
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 dark:text-white">
        <Folder size={30} className="text-yellow-400" />
        <span>My Projects</span>
      </h2>

      {/* Finder-Style Grid of Folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="cursor-pointer flex flex-col items-center justify-center 
                      bg-gray-100/50 dark:bg-white/10 rounded-md p-6 
                      hover:bg-gray-200/50 dark:hover:bg-white/20 transition"
          >
            <Folder size={48} className="text-yellow-400 mb-2" />
            <p className="text-lg font-semibold dark:text-white">
              {project.title}
            </p>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                        w-96 max-w-full rounded-lg shadow-2xl p-4 relative"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedProject.title}</h3>
                <XSquare
                  size={24}
                  className="cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => setSelectedProject(null)}
                />
              </div>

              <p className="mb-3 dark:text-gray-300">
                {selectedProject.description}
              </p>
              <p className="mb-3 dark:text-gray-300">
                <strong>Tech Stack:</strong>{" "}
                {selectedProject.techStack.join(", ")}
              </p>

              <div className="flex gap-3">
                <a
                  href={selectedProject.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                >
                  Live Demo
                </a>
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded"
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
