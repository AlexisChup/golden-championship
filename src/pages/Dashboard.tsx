export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">
          Personalized dashboard based on your role
        </p>
        <div className="text-4xl mb-4 text-center">📊</div>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">👤</div>
            <div className="font-semibold text-gray-700">Profile</div>
            <div className="text-sm text-gray-500">Manage your profile</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-semibold text-gray-700">Competitions</div>
            <div className="text-sm text-gray-500">Your competitions</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-semibold text-gray-700">Settings</div>
            <div className="text-sm text-gray-500">Configuration</div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-6">
          Page under construction - Coming soon
        </p>
      </div>
    </div>
  )
}
