import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft, MapPin, Users, Zap, Shield, Globe, Heart } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-8 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <MapPin className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 tracking-tight">
            About RouteConnect
          </h1>
          <p className="text-lg text-blue-700 font-medium max-w-3xl mx-auto leading-relaxed">
            Revolutionizing travel across India with intelligent route planning, real-time updates, and seamless connections for modern travelers.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-2xl bg-white p-8 border border-blue-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900">Our Mission</h2>
            </div>
            <p className="text-blue-800 leading-relaxed">
              To empower travelers across India by providing intelligent, reliable, and sustainable route planning solutions. We connect people to their destinations with efficiency, transparency, and care.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 border border-blue-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900">Our Vision</h2>
            </div>
            <p className="text-blue-800 leading-relaxed">
              To build the most trusted travel network in India, where every journey is seamless, affordable, and accessible to everyone. Creating a future of connected communities.
            </p>
          </div>
        </div>

        {/* Features & Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Why Choose RouteConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 border border-blue-200/50 hover:shadow-lg transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Smart Route Planning</h3>
              <p className="text-blue-800">
                AI-powered algorithms find the best routes based on your preferences, budget, and time constraints.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 p-8 border border-purple-200/50 hover:shadow-lg transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Real-Time Updates</h3>
              <p className="text-blue-800">
                Get instant notifications about delays, connections, and route changes. Stay updated every step of the way.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 border border-emerald-200/50 hover:shadow-lg transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Secure & Reliable</h3>
              <p className="text-blue-800">
                Your journey is our priority. Verified operators, transparent pricing, and 24/7 customer support.
              </p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="rounded-2xl bg-white border border-blue-200/50 p-10 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">About RouteConnect</h2>
          <div className="space-y-6 text-blue-800 leading-relaxed">
            <p>
              <strong className="text-blue-900">RouteConnect</strong> is India's premier digital platform for intelligent route discovery and travel planning. Founded in 2026, we've revolutionized how millions of Indians plan their journeys.
            </p>
            <p>
              We partner with over 500+ transport operators across India, including major bus operators, railway services, and private transport providers. Our platform processes over 10 million route searches daily, helping travelers find the perfect balance between cost, comfort, and convenience.
            </p>
            <p>
              Our team of travel technologists, engineers, and customer success specialists work tirelessly to ensure every journey is smooth, safe, and satisfying. We believe in sustainable travel and actively promote eco-friendly transportation options.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <Users className="h-7 w-7" />
                </div>
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Customer First</h3>
              <p className="text-sm text-blue-800">Your satisfaction drives everything we do</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                  <Globe className="h-7 w-7" />
                </div>
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Sustainability</h3>
              <p className="text-sm text-blue-800">Committed to eco-friendly travel solutions</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white">
                  <Shield className="h-7 w-7" />
                </div>
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Transparency</h3>
              <p className="text-sm text-blue-800">Clear pricing, honest information always</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white">
                  <Heart className="h-7 w-7" />
                </div>
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Innovation</h3>
              <p className="text-sm text-blue-800">Continuously improving the travel experience</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center bg-white rounded-xl p-8 border border-blue-200/50 shadow-lg">
            <p className="text-4xl font-bold text-blue-600 mb-2">10M+</p>
            <p className="text-blue-900 font-semibold">Daily Searches</p>
          </div>
          <div className="text-center bg-white rounded-xl p-8 border border-blue-200/50 shadow-lg">
            <p className="text-4xl font-bold text-purple-600 mb-2">500+</p>
            <p className="text-blue-900 font-semibold">Partner Operators</p>
          </div>
          <div className="text-center bg-white rounded-xl p-8 border border-blue-200/50 shadow-lg">
            <p className="text-4xl font-bold text-emerald-600 mb-2">5M+</p>
            <p className="text-blue-900 font-semibold">Active Users</p>
          </div>
          <div className="text-center bg-white rounded-xl p-8 border border-blue-200/50 shadow-lg">
            <p className="text-4xl font-bold text-orange-600 mb-2">28</p>
            <p className="text-blue-900 font-semibold">Major Indian States</p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-12 text-center text-white shadow-xl mb-8">
          <h2 className="text-3xl font-bold mb-4">Get in Touch With Us</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Contact our support team available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div>
              <p className="text-sm text-blue-100">Email</p>
              <p className="font-bold">support@routeconnect.com</p>
            </div>
            <div className="hidden sm:block text-blue-300">•</div>
            <div>
              <p className="text-sm text-blue-100">Phone</p>
              <p className="font-bold">1-800-ROUTE-CONNECT</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-blue-200/50 pt-8">
          <p className="text-blue-600 font-semibold">© 2026 RouteConnect. All rights reserved.</p>
          <p className="text-sm text-blue-600 mt-2">Connecting India, One Journey at a Time</p>
        </div>
      </main>
    </div>
  );
}
