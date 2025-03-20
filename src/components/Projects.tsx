export default function Projects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-white/50 rounded-lg">
        <h3 className="font-bold">Project 1</h3>
        <p>Description of your amazing project goes here.</p>
      </div>
      <div className="p-4 bg-white/50 rounded-lg">
        <h3 className="font-bold">Project 2</h3>
        <p>Description of another fantastic project.</p>
      </div>
    </div>
  );
}