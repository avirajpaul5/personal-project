import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import {
  MagnifyingGlassIcon,
  DocumentIcon,
  UserIcon,
  EnvelopeIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onAppClick: (id: string) => void;
}

const searchItems = [
  {
    id: "about",
    name: "About Me",
    icon: UserIcon,
    description: "Learn more about me and my background",
  },
  {
    id: "projects",
    name: "Projects",
    icon: DocumentIcon,
    description: "View my portfolio projects",
  },
  {
    id: "contact",
    name: "Contact",
    icon: EnvelopeIcon,
    description: "Get in touch with me",
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: CommandLineIcon,
    description: "Open the terminal",
  },
];

export default function SpotlightSearch({
  isOpen,
  onClose,
  onAppClick,
}: SpotlightSearchProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : setSearch("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onClose]);

  const handleSelect = (id: string) => {
    onAppClick(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed left-1/3 top-[20%] -translate-x-1/2 w-full max-w-xl z-50"
          >
            <Command
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl overflow-hidden"
              value={search}
              onValueChange={setSearch}
            >
              <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 mr-5 ml-1" />
                <Command.Input
                  autoFocus
                  placeholder="Search..."
                  className="flex-1 h-12 bg-transparent border-0 outline-none placeholder:text-gray-500 text-sm text-gray-300"
                />
                <kbd className="hidden md:block text-xs font-mono text-gray-500 px-1.5 py-0.5 border border-gray-300 dark:border-gray-700 rounded">
                  esc
                </kbd>
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="text-sm text-gray-500 text-center py-4">
                  No results found.
                </Command.Empty>
                {searchItems.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.name}
                    onSelect={() => handleSelect(item.id)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 text-gray-300"
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-500 text-xs">
                        {item.description}
                      </div>
                    </div>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
