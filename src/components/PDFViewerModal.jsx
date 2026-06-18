// src/components/PDFViewerModal.jsx
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaDownload, FaSearchPlus, FaSearchMinus,
  FaChevronLeft, FaChevronRight, FaExpand, FaCompress,
  FaExternalLinkAlt, FaExclamationTriangle, FaSpinner
} from 'react-icons/fa';
import { useNavbar } from '../contexts/NavbarContext';

// Import styles for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Category color configurations (matching ProjectSection.jsx)
const categoryConfig = {
  'Web Security': {
    gradient: 'from-cyan-600 to-cyan-500',
    border: 'border-cyan-400/30',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  'Cloud Security': {
    gradient: 'from-sky-600 to-sky-500',
    border: 'border-sky-400/30',
    text: 'text-sky-400',
    bg: 'bg-sky-500/10'
  },
  'Blue Team Operations': {
    gradient: 'from-indigo-600 to-indigo-500',
    border: 'border-indigo-400/30',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10'
  },
  'Network Security': {
    gradient: 'from-emerald-600 to-emerald-500',
    border: 'border-emerald-400/30',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  'Malware Analysis': {
    gradient: 'from-red-600 to-red-500',
    border: 'border-red-400/30',
    text: 'text-red-400',
    bg: 'bg-red-500/10'
  }
};

const PDFViewerModal = ({ pdfUrl, projectTitle, projectCategory, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const { hideNavbar, showNavbar } = useNavbar();

  const categoryColors = categoryConfig[projectCategory] || categoryConfig['Web Security'];

  // Hide navbar when modal opens
  React.useEffect(() => {
    hideNavbar();
    return () => showNavbar();
  }, [hideNavbar, showNavbar]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError(error);
    setLoading(false);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      return Math.max(1, Math.min(newPage, numPages || 1));
    });
  };

  const jumpToPage = (page) => {
    const pageNum = parseInt(page, 10);
    if (pageNum >= 1 && pageNum <= numPages) {
      setPageNumber(pageNum);
    }
  };

  const handleZoom = (direction) => {
    setScale(prevScale => {
      if (direction === 'in') return Math.min(prevScale + 0.2, 3.0);
      if (direction === 'out') return Math.max(prevScale - 0.2, 0.5);
      if (direction === 'reset') return 1.2;
      if (direction === 'fit-width') return 1.0;
      if (direction === 'fit-page') return 0.8;
      return prevScale;
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setShowThumbnails(true);
    } else {
      setShowThumbnails(false);
    }
  };

  const containerClass = isFullscreen
    ? "fixed inset-0 w-full h-full rounded-none"
    : "relative w-full max-w-6xl h-[90vh] rounded-3xl";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${containerClass} dark:bg-slate-900/98 bg-white overflow-hidden flex flex-col border dark:border-slate-700/50 border-slate-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 md:p-6 border-b dark:border-slate-700/50 border-slate-200 bg-gradient-to-r ${categoryColors.gradient} bg-opacity-10`}>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold dark:text-white text-slate-900 truncate">
              {projectTitle}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs md:text-sm px-2 md:px-3 py-1 rounded-full ${categoryColors.bg} ${categoryColors.text} border ${categoryColors.border} font-semibold`}>
                {projectCategory}
              </span>
              <span className="text-xs md:text-sm dark:text-slate-400 text-slate-600">
                Evidence Report PDF
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={toggleFullscreen}
              className="p-2 md:p-3 rounded-full dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all duration-300 group"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <FaCompress className="dark:text-white text-slate-700 text-sm md:text-base" />
              ) : (
                <FaExpand className="dark:text-white text-slate-700 text-sm md:text-base" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 md:p-3 rounded-full dark:bg-slate-800 bg-slate-100 hover:bg-red-500/20 transition-all duration-300 group"
              title="Close viewer"
            >
              <FaTimes className="dark:text-white text-slate-700 group-hover:text-red-500 text-sm md:text-base" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Thumbnail Sidebar (only in fullscreen) */}
          {isFullscreen && showThumbnails && numPages && (
            <div className="w-48 border-r dark:border-slate-700/50 border-slate-200 overflow-y-auto dark:bg-slate-950 bg-slate-50 hidden lg:block">
              <div className="p-2 space-y-2">
                {[...Array(numPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPageNumber(pageNum)}
                      className={`w-full p-2 rounded-lg border-2 transition-all duration-200 ${
                        pageNumber === pageNum
                          ? `${categoryColors.border} ${categoryColors.bg}`
                          : 'border-transparent dark:hover:bg-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs dark:text-slate-400 text-slate-600 mb-1">
                        Page {pageNum}
                      </div>
                      <div className="w-full aspect-[8.5/11] dark:bg-slate-900 bg-white rounded overflow-hidden">
                        <Document file={pdfUrl} loading={<div className="w-full h-full flex items-center justify-center"><FaSpinner className="animate-spin text-sm" /></div>}>
                          <Page
                            pageNumber={pageNum}
                            width={150}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </Document>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main PDF Display */}
          <div className="flex-1 overflow-auto dark:bg-slate-950 bg-slate-100 flex items-center justify-center p-4">
            {loading && (
              <div className="flex flex-col items-center justify-center p-8 md:p-12">
                <div className="relative">
                  <FaSpinner className={`text-4xl md:text-6xl animate-spin ${categoryColors.text}`} />
                </div>
                <p className="mt-4 md:mt-6 text-sm md:text-base dark:text-slate-400 text-slate-600 font-medium">
                  Loading PDF Evidence...
                </p>
                <p className="mt-2 text-xs dark:text-slate-500 text-slate-400">
                  This may take a moment for large files
                </p>
              </div>
            )}

            {error && (
              <div className="p-6 md:p-8 text-center max-w-md">
                <FaExclamationTriangle className="text-4xl md:text-5xl text-red-500 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold dark:text-white text-slate-900 mb-2">
                  Failed to Load PDF
                </h3>
                <p className="dark:text-slate-400 text-slate-600 text-sm md:text-base mb-4">
                  {error.message || 'An error occurred while loading the PDF.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r ${categoryColors.gradient} hover:opacity-90 text-white font-bold rounded-xl transition-all duration-300`}
                  >
                    <FaExternalLinkAlt className="text-sm" />
                    Open in Browser
                  </a>
                  <a
                    href={pdfUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 dark:bg-slate-800 bg-slate-200 dark:hover:bg-slate-700 hover:bg-slate-300 dark:text-white text-slate-700 font-bold rounded-xl transition-all duration-300"
                  >
                    <FaDownload className="text-sm" />
                    Download
                  </a>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="pdf-container">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={<div className="text-center p-8"><FaSpinner className="animate-spin text-3xl mx-auto" /></div>}
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-2xl"
                  />
                </Document>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 md:p-4 border-t dark:border-slate-700/50 border-slate-200 dark:bg-slate-900/50 bg-white/50 backdrop-blur-sm">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  pageNumber <= 1
                    ? 'dark:bg-slate-800/50 bg-slate-200 dark:text-slate-600 text-slate-400 cursor-not-allowed'
                    : 'dark:bg-slate-800 bg-slate-200 dark:hover:bg-slate-700 hover:bg-slate-300 dark:text-white text-slate-700'
                }`}
                title="Previous page"
              >
                <FaChevronLeft className="text-sm" />
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={numPages || 1}
                  value={pageNumber}
                  onChange={(e) => jumpToPage(e.target.value)}
                  className="w-12 md:w-16 px-2 py-1 text-center text-sm rounded-lg dark:bg-slate-800 bg-slate-200 dark:text-white text-slate-900 border dark:border-slate-700 border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-xs md:text-sm dark:text-slate-400 text-slate-600 whitespace-nowrap">
                  of {numPages || '?'}
                </span>
              </div>

              <button
                onClick={() => changePage(1)}
                disabled={pageNumber >= numPages}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  pageNumber >= numPages
                    ? 'dark:bg-slate-800/50 bg-slate-200 dark:text-slate-600 text-slate-400 cursor-not-allowed'
                    : 'dark:bg-slate-800 bg-slate-200 dark:hover:bg-slate-700 hover:bg-slate-300 dark:text-white text-slate-700'
                }`}
                title="Next page"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoom('out')}
                disabled={scale <= 0.5}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  scale <= 0.5
                    ? 'dark:bg-slate-800/50 bg-slate-200 dark:text-slate-600 text-slate-400 cursor-not-allowed'
                    : 'dark:bg-slate-800 bg-slate-200 dark:hover:bg-slate-700 hover:bg-slate-300 dark:text-white text-slate-700'
                }`}
                title="Zoom out"
              >
                <FaSearchMinus className="text-sm" />
              </button>

              <select
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="px-2 md:px-3 py-1.5 text-xs md:text-sm rounded-lg dark:bg-slate-800 bg-slate-200 dark:text-white text-slate-900 border dark:border-slate-700 border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="0.5">50%</option>
                <option value="0.75">75%</option>
                <option value="1.0">100%</option>
                <option value="1.2">120%</option>
                <option value="1.5">150%</option>
                <option value="2.0">200%</option>
                <option value="3.0">300%</option>
              </select>

              <button
                onClick={() => handleZoom('in')}
                disabled={scale >= 3.0}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  scale >= 3.0
                    ? 'dark:bg-slate-800/50 bg-slate-200 dark:text-slate-600 text-slate-400 cursor-not-allowed'
                    : 'dark:bg-slate-800 bg-slate-200 dark:hover:bg-slate-700 hover:bg-slate-300 dark:text-white text-slate-700'
                }`}
                title="Zoom in"
              >
                <FaSearchPlus className="text-sm" />
              </button>
            </div>

            {/* Download Button */}
            <a
              href={pdfUrl}
              download
              className={`flex items-center justify-center gap-2 px-3 md:px-6 py-2 md:py-2.5 bg-gradient-to-r ${categoryColors.gradient} hover:opacity-90 text-white text-sm md:text-base font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap`}
              title="Download PDF"
            >
              <FaDownload className="text-sm" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PDFViewerModal;
