export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
        <p className="text-lg text-gray-600">Golden Championship Platform</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🥊 The Project</h3>
          <p className="text-gray-600 leading-relaxed">
            Golden Championship is a modern platform for managing combat sports competitions and tournaments. 
            Built with React, TypeScript, and the best web development practices.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">⚡ Technologies</h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>• React 19 + TypeScript</li>
            <li>• Vite + Tailwind CSS</li>
            <li>• Axios + React Hot Toast</li>
            <li>• React Router + Zustand</li>
          </ul>
        </div>
      </div>

      <div className="bg-linear-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">🚀 Project Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-sm font-medium text-gray-700">Setup</div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-2xl mb-2">🔧</div>
            <div className="text-sm font-medium text-gray-700">API Integration</div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-2xl mb-2">🎨</div>
            <div className="text-sm font-medium text-gray-700">UI/UX</div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-sm font-medium text-gray-700">Ready to develop</div>
          </div>
        </div>
      </div>
    </div>
  )
}
