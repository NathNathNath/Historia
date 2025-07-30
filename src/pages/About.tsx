import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 fixed inset-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 relative z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12">
                <img src="/assets/logo.png" alt="Historia Logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                HISTORIA - AI
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/about" className="text-indigo-600 font-medium border-b-2 border-indigo-600">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              Help
            </Link>
            <Link to="/">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* About Content */}
      <main className="relative overflow-auto h-full pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto py-12 px-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header gradient */}
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-500 to-yellow-400 rounded-t-2xl"></div>
            
            {/* Title */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg mb-4">
                <img src="/assets/logo.png" alt="Historia Logo" className="w-12 h-12 object-contain" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                About HISTORIA
              </h1>
              <p className="text-gray-600">
                Revolutionizing history education through AI
              </p>
            </div>
            
            {/* Mission section */}
            <section className="mb-12 border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">
                Our Mission
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
              </h2>
              <p className="text-center text-gray-600 max-w-2xl mx-auto leading-relaxed">
                HISTORIA-AI is dedicated to revolutionizing the way we learn and teach history through
                artificial intelligence. Our platform combines cutting-edge AI technology with
                comprehensive historical data to create an engaging and interactive learning experience.
              </p>
            </section>
            
            {/* What We Offer section */}
            <section className="mb-12 border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-center text-purple-700 mb-8">
                What We Offer
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border border-white/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-indigo-600 font-semibold text-lg mb-3">
                      AI-Powered Learning
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Personalized learning experiences tailored to each student's needs and pace.
                    </p>
                  </div>
                </div>
                
                {/* Card 2 */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border border-white/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-indigo-600 font-semibold text-lg mb-3">
                      Interactive Content
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Engaging historical content with multimedia resources and interactive elements.
                    </p>
                  </div>
                </div>
                
                {/* Card 3 */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border border-white/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-indigo-600 font-semibold text-lg mb-3">
                      Progress Tracking
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Comprehensive tracking and analytics to monitor student progress and understanding.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Vision section */}
            <section>
              <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">
                Our Vision
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
              </h2>
              <p className="text-center text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We envision a future where history education is dynamic, engaging, and accessible to all.
                Through our platform, we aim to make historical learning an immersive experience that
                connects the past with the present, helping students understand how historical events
                shape our world today.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}