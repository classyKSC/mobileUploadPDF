const PDFViewer = ({ signedPdfUrl, handleReset }: { signedPdfUrl: string, handleReset: () => void }) => {
    
      const handleDownload = () => {
        if (signedPdfUrl) {
          const link = document.createElement('a')
          link.href = signedPdfUrl
          link.download = 'signed-document.pdf'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    return (
        <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Signed PDF Ready
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Your document has been successfully signed
                  </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleDownload}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm md:text-base"
                  >
                    Download
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm md:text-base"
                  >
                    New Document
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <iframe
                  src={signedPdfUrl}
                  className="w-full h-[60vh] md:h-[70vh] min-h-[400px]"
                  title="Signed PDF Viewer"
                />
              </div>
            </div>
    )
}

export default PDFViewer