export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Mohamad Syafiq Hamdani
        </h1>
        <p className="mt-4 text-xl text-gray-400">
          Multimedia Computing | Digital Graphics & Design
        </p>
        <div className="mt-8 p-6 border border-gray-800 rounded-lg bg-gray-900/50">
          <p className="text-gray-300">
            Completed internship at MATAC. 
            Passionate about Multimedia Computing and Creative Design.
          </p>
        </div>
      </div>
    </main>
  );
}