// src/components/MobilePDFPrompt.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaDownload, FaExternalLinkAlt, FaEye,
  FaMobileAlt, FaExclamationCircle
} from 'react-icons/fa';

const MobilePDFPrompt = ({ pdfUrl, fileName, fileSize, onViewInApp, onClose }) => {
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const displaySize = formatFileSize(fileSize);
  const isLargeFile = fileSize > 5 * 1024 * 1024; // > 5MB

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md dark:bg-slate-900/95 bg-white rounded-3xl overflow-hidden border dark:border-slate-700/50 border-slate-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b dark:border-slate-700/50 border-slate-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full dark:bg-slate-800 bg-slate-100 hover:bg-red-500/20 transition-all duration-300 group"
          >
            <FaTimes className="dark:text-white text-slate-700 group-hover:text-red-500 text-sm" />
          </button>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 bg-opacity-10">
              <FaMobileAlt className="text-2xl text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-1">
                Mobile PDF Viewer
              </h3>
              <p className="text-sm dark:text-slate-400 text-slate-600">
                Choose how to view this evidence report
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* File Info */}
          <div className="flex items-center gap-3 p-4 rounded-xl dark:bg-slate-800/50 bg-slate-50 border dark:border-slate-700/50 border-slate-200">
            {isLargeFile && (
              <FaExclamationCircle className="text-yellow-500 text-xl flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium dark:text-white text-slate-900 truncate">
                {fileName || 'Evidence Report'}
              </p>
              <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                File size: <span className="font-semibold">{displaySize}</span>
                {isLargeFile && <span className="text-yellow-500 ml-1">(Large file)</span>}
              </p>
            </div>
          </div>

          {/* Warning for large files */}
          {isLargeFile && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs dark:text-yellow-300 text-yellow-700 leading-relaxed">
                <strong>Note:</strong> This is a large PDF file. Viewing in-app may be slower on mobile devices.
                Consider opening in your browser or downloading for better performance.
              </p>
            </div>
          )}

          {/* Options */}
          <div className="space-y-2">
            {/* View In-App */}
            <button
              onClick={() => {
                onViewInApp();
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 rounded-xl dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all duration-300 group border-2 border-transparent hover:border-cyan-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
                  <FaEye className="text-base" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold dark:text-white text-slate-900">
                    View In-App
                  </p>
                  <p className="text-xs dark:text-slate-400 text-slate-600">
                    {isLargeFile ? 'May be slower for large files' : 'Recommended option'}
                  </p>
                </div>
              </div>
              <FaEye className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Open in Browser */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full flex items-center justify-between p-4 rounded-xl dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all duration-300 group border-2 border-transparent hover:border-sky-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg dark:bg-slate-700 bg-slate-200 text-sky-500">
                  <FaExternalLinkAlt className="text-base" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold dark:text-white text-slate-900">
                    Open in Browser
                  </p>
                  <p className="text-xs dark:text-slate-400 text-slate-600">
                    {isLargeFile ? 'Better for large files' : 'Use native PDF viewer'}
                  </p>
                </div>
              </div>
              <FaExternalLinkAlt className="text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Download */}
            <a
              href={pdfUrl}
              download
              onClick={onClose}
              className="w-full flex items-center justify-between p-4 rounded-xl dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all duration-300 group border-2 border-transparent hover:border-emerald-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg dark:bg-slate-700 bg-slate-200 text-emerald-500">
                  <FaDownload className="text-base" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold dark:text-white text-slate-900">
                    Download PDF
                  </p>
                  <p className="text-xs dark:text-slate-400 text-slate-600">
                    Save to your device
                  </p>
                </div>
              </div>
              <FaDownload className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-t dark:border-slate-700/50 border-slate-200">
          <p className="text-xs text-center dark:text-slate-500 text-slate-400">
            Tip: For best experience with large PDFs, use a desktop device
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobilePDFPrompt;
