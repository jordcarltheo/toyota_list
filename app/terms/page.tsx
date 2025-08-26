import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Download, FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Rules and guidelines for using ToyotaList.com
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <FileText className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Download Terms of Service
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Click the button below to download our complete Terms of Service document.
              </p>
              <a
                href="/terms-of-service.pdf"
                download
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </a>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Terms of Service Overview
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By using ToyotaList.com, you agree to abide by our Terms of Service. These terms govern your use of our 
                marketplace and outline the responsibilities of both users and ToyotaList.com.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Key terms include:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>User account responsibilities</li>
                <li>Listing and transaction guidelines</li>
                <li>Prohibited activities and content</li>
                <li>Fee structure and payment terms</li>
                <li>Dispute resolution procedures</li>
                <li>Limitation of liability</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                For complete details, please download and review our full Terms of Service document above.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
