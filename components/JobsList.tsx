'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Bookmark } from 'lucide-react'

export default function JobsList({ initialJobs }: { initialJobs: any[] }) {
  // Core Filtering State
  const [searchTerm, setSearchTerm] = useState('')
  const [region, setRegion] = useState('')
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [sortOption, setSortOption] = useState('newest')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 20

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, region, jobTypes, sortOption])

  // 1. Filter Logic (Search, Region, and Job Type)
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRegion = region === '' || job.location === region
      const matchesType = jobTypes.length === 0 || jobTypes.includes(job.type)
      return matchesSearch && matchesRegion && matchesType
    })
  }, [initialJobs, searchTerm, region, jobTypes])

  // 2. Sort Logic (Professional market options)
  const sortedJobs = useMemo(() => {
    const sorted = [...filteredJobs]
    switch (sortOption) {
      case 'salary-desc':
        return sorted.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0))
      case 'salary-asc':
        return sorted.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0))
      case 'newest':
      default:
        // Assuming initialJobs are already sorted by date, but we can reverse if needed
        return sorted
    }
  }, [filteredJobs, sortOption])

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage)
  const currentJobs = sortedJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  )

  // Toggle Job Type filter
  const toggleJobType = (type: string) => {
    setJobTypes((prev) => 
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setRegion('')
    setJobTypes([])
    setCurrentPage(1)
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div>
      {/* Navy Blue Hero Section */}
      <div className="bg-[#0f172a] text-white px-4 py-12 md:py-20 md:px-20 rounded-b-[40px]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Find Your Next Remote Role</h1>
          <p className="text-slate-300 mb-8">Join the world's best companies. Work from anywhere.</p>
          
          <div className="bg-white p-3 rounded-2xl flex flex-col md:flex-row gap-3 shadow-xl">
            <div className="flex-1 flex items-center gap-3 px-3 py-2">
              <Search className="text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Job title, keywords, or company" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(1)}
                className="w-full bg-transparent outline-none text-slate-800" 
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-3 py-2 border-t md:border-t-0 md:border-l border-slate-200">
              <MapPin className="text-slate-400 w-5 h-5" />
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)} 
                className="w-full bg-transparent outline-none text-slate-800 cursor-pointer"
              >
                <option value="">Any Region</option>
                <option value="Worldwide">Worldwide</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="EMEA">EMEA</option>
                <option value="APAC">APAC</option>
              </select>
            </div>
            <button onClick={() => setCurrentPage(1)} className="bg-black text-white px-8 py-3 rounded-full font-semibold">
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Yellow Guarantee Banner */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-6 flex items-center gap-4 mb-8">
          <div className="bg-[#f59e0b] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">✓</div>
          <div>
            <h4 className="text-[#0f172a] font-semibold">Curated Quality Guarantee</h4>
            <p className="text-slate-500 text-sm">Every job listed on this platform has been manually vetted.</p>
          </div>
        </div>

        {/* Layout: Sidebar + Job List */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          
          {/* Left Sidebar Filters */}
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-lg">Filters</h4>
                <span className="text-slate-500 cursor-pointer text-sm font-medium hover:text-blue-600" onClick={clearFilters}>Clear all</span>
              </div>
              
              {/* JOB TYPE - Now Fully Functional */}
              <div className="mb-8">
                <h5 className="font-semibold mb-3">Job Type</h5>
                {['Full-time', 'Contract', 'Part-time', 'Freelance'].map(type => (
                  <label key={type} className="flex items-center gap-2 mb-3 text-slate-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4"
                      checked={jobTypes.includes(type)}
                      onChange={() => toggleJobType(type)}
                    /> 
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Jobs */}
          <div>
            {/* Top Bar: Left "X Jobs Found", Right Market-Standard Sort Dropdown */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h3 className="font-bold text-xl text-[#0f172a]">{sortedJobs.length} Jobs Found</h3>
              
              {/* PROFESSIONAL SORTING - Now Fully Functional */}
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-slate-200 rounded-lg p-2 text-sm cursor-pointer"
              >
                <option value="newest">Most Recent</option>
                <option value="salary-desc">Highest Salary</option>
                <option value="salary-asc">Lowest Salary</option>
              </select>
            </div>

            {/* Job Cards */}
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-6 mb-4">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                      <div className="w-12 h-12 bg-slate-200 rounded-xl shrink-0"></div>
                      <div className="w-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-[#0f172a]">{job.title}</h4>
                        </div>
                        <p className="text-slate-500 text-sm mb-3">{job.company} • {job.location}</p>
                        <p className="text-slate-600 text-sm mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">🌐 {job.location}</span>
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">💼 {job.type}</span>
                          {job.salaryMin && job.salaryMax && (<span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">💰 ${job.salaryMin}k - ${job.salaryMax}k</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center md:flex-col md:items-end">
                      <button className="bg-transparent border-none cursor-pointer"><Bookmark className="text-slate-500 w-5 h-5" /></button>
                      <Link href={`/jobs/${job.id}`} className="bg-white border border-slate-200 text-[#0f172a] px-5 py-2 rounded-full text-sm font-medium">
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                <p className="text-slate-500">No jobs found. Try adjusting your filters.</p>
              </div>
            )}

            {/* Professional Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      currentPage === number
                        ? 'bg-[#0f172a] text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {number}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}