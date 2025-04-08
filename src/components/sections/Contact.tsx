import { ExternalLink, Inbox } from "lucide-react";

export default function Contact() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold dark:text-white">Get in Touch</h2>
      <div className="space-y-2 dark:text-gray-300">
        <a href="mailto:avirajpaul5@gmail.com">
          <Inbox className="inline-flex items-center w-4 h-4 ml-1 mb-1 mr-1" />{" "}
          Email
        </a>
        <br />
        <a
          href="https://github.com/avirajpaul5"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 GitHub
          <ExternalLink className="inline-flex items-center w-4 h-4 ml-1 mb-1" />
        </a>
        <br />
        <a
          href="https://www.linkedin.com/in/aviraj-paul/"
          target="_blank"
          rel="noopener noreferrer"
        >
          💼 LinkedIn
          <ExternalLink className="inline-flex items-center w-4 h-4 ml-1 mb-1" />
        </a>
        <br />
      </div>
    </div>
  );
}
