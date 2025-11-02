import { useState } from 'react'
import './App.css'
import { signPDF } from './services/pdfSigningService'
import PDFViewer from './components/PDFViewer'

type AppState = 'upload' | 'uploading' | 'signing' | 'viewing'

function App() {
  const [state, setState] = useState<AppState>('upload')
  const [originalPdfUrl, setOriginalPdfUrl] = useState<string | null>(null)
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setError(null)
    setState('uploading')

    // Create URL for original PDF
    const originalUrl = URL.createObjectURL(file)
    setOriginalPdfUrl(originalUrl)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Send to mock server for signing
    setState('signing')
    try {
      const signedPdfBlob = await signPDF(file)
      const signedUrl = URL.createObjectURL(signedPdfBlob)
      setSignedPdfUrl(signedUrl)
      setState('viewing')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign PDF')
      setState('upload')
    }
  }

  const handleReset = () => {
    // Clean up blob URLs
    if (originalPdfUrl) URL.revokeObjectURL(originalPdfUrl)
    if (signedPdfUrl) URL.revokeObjectURL(signedPdfUrl)
    
    setState('upload')
    setOriginalPdfUrl(null)
    setSignedPdfUrl(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-400 to-red-500 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-50 mb-2">
            PDF Signing App
          </h1>
          <p className="text-gray-100 text-sm md:text-base">
            Upload your PDF for digital signing
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
          {state === 'upload' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                  disabled={state !== 'upload'}
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <svg
                    className="w-16 h-16 md:w-20 md:h-20 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div>
                    <span className="text-red-600 font-semibold text-lg">
                      Tap to upload PDF
                    </span>
                    <p className="text-gray-500 text-sm mt-2">
                      Supported format: PDF (max 10MB)
                    </p>
                  </div>
                </label>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          )}

          {(state === 'uploading' || state === 'signing') && (
            <div className="flex flex-col items-center justify-center py-12 md:py-16 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-gray-800">
                  {state === 'uploading' ? 'Uploading PDF...' : 'Signing PDF...'}
                </p>
                <p className="text-gray-500 text-sm md:text-base mt-2">
                  {state === 'uploading'
                    ? 'Please wait while we process your file'
                    : 'This may take a few moments'}
                </p>
              </div>
            </div>
          )}

          {state === 'viewing' && signedPdfUrl && (
            <PDFViewer signedPdfUrl={signedPdfUrl} handleReset={handleReset} />
          )}
        </main>

        <footer className="text-center mt-6 text-gray-200 text-sm">
          <p>Mobile-friendly PDF signing application for Delta Capita</p>
        </footer>
      </div>
    </div>
  )
}

export default App
