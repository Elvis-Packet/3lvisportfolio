import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaComment,
  FaCamera,
  FaHeart,
  FaReply,
  FaTrash,
  FaThumbtack
} from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { supabase } from '../lib/supabase';

const Contact = () => {
  // States untuk contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // States untuk comments
  const [commentForm, setCommentForm] = useState({
    name: '',
    message: '',
    photo: null,
    photoPreview: null
  });
  const [comments, setComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Load comments dari Supabase
  useEffect(() => {
    fetchComments();
  }, []);

  // Fetch comments dari database
  const fetchComments = async () => {
    if (!supabase) {
      console.log('⚠️ Supabase not configured, comments disabled');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('is_pinned', { ascending: false })  // Pinned comments first
        .order('created_at', { ascending: false }); // Then by date

      if (error) throw error;

      if (data) {
        console.log('✅ Comments fetched from database:', data.length);
        // Transform data dari Supabase ke format yang dipakai component
        const transformedComments = data.map(comment => ({
          id: comment.id,
          name: comment.name,
          message: comment.message,
          photo: comment.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=00ffdc&color=000754&size=100`,
          timestamp: comment.created_at,
          likes: comment.likes || 0,
          isPinned: comment.is_pinned || false  // ✨ NEW: Pin status
        }));
        setComments(transformedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Fallback ke localStorage jika gagal
      const savedComments = localStorage.getItem('portfolioComments');
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    }
  };

  // Handle contact form
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      // Save message to Supabase
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: contactForm.name,
            email: contactForm.email,
            message: contactForm.message,
            status: 'unread'
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Message saved to database:', data);

      alert('Pesan berhasil dikirim! Terima kasih telah menghubungi saya. 📧');
      setContactForm({ name: '', email: '', message: '' });

    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert(`Gagal mengirim pesan: ${error.message}. Pastikan koneksi database aktif.`);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCommentForm(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle comment submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.message.trim()) return;

    setIsSubmittingComment(true);

    try {
      // Save comment to Supabase
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            name: commentForm.name,
            message: commentForm.message,
            photo_url: commentForm.photoPreview || null,
            likes: 0
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Comment saved to database:', data);

      // Refresh comments list dari database
      await fetchComments();

      // Reset form
      setCommentForm({ name: '', message: '', photo: null, photoPreview: null });

      // Show success message
      alert('Comment berhasil dipost! 🎉');

    } catch (error) {
      console.error('Error submitting comment:', error);
      alert(`Gagal posting comment: ${error.message}. Pastikan koneksi database aktif.`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle like comment
  const handleLikeComment = async (commentId) => {
    try {
      // Find current comment
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      // Update likes in Supabase
      const { error } = await supabase
        .from('comments')
        .update({ likes: comment.likes + 1 })
        .eq('id', commentId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Like updated in database');

      // Update local state untuk tampilan langsung
      const updatedComments = comments.map(c =>
        c.id === commentId
          ? { ...c, likes: c.likes + 1 }
          : c
      );
      setComments(updatedComments);

    } catch (error) {
      console.error('Error liking comment:', error);
      alert(`Gagal like comment: ${error.message}`);
    }
  };


  const socialLinks = [
    {
      name: 'Email',
      icon: <FaEnvelope />,
      url: 'mailto:packetelvis@gmail.com',
      color: 'from-red-500 to-orange-600',
      hoverColor: 'hover:shadow-red-500/25'
    },
    {
      name: 'GitHub',
      icon: <FaGithub />,
      url: 'https://github.com/Elvis-Packet',
      color: 'from-gray-600 to-gray-800',
      hoverColor: 'hover:shadow-gray-500/25'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin />,
      url: 'https://www.linkedin.com/in/elvis-mbugua-89b177331/',
      color: 'from-blue-500 to-blue-700',
      hoverColor: 'hover:shadow-blue-500/25'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      url: 'https://instagram.com/packet_elvis',
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'hover:shadow-pink-500/25'
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 pb-32 relative overflow-hidden min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-transparent"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20 relative"
        >
          <h2 className="text-5xl md:text-6xl font-bold font-moderniz mb-4">
            <span className="dark:bg-gradient-to-r dark:from-cyan-400 dark:via-emerald-400 dark:to-cyan-600 dark:bg-clip-text dark:text-transparent text-cyan-600">
              GET IN
            </span>
            {' '}
            <span className="dark:text-white text-slate-800">TOUCH</span>
          </h2>
          <p className="text-xl dark:text-slate-400 text-slate-600 font-cascadia">
            Let's collaborate and create something amazing!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-12 lg:gap-20 max-w-2xl mx-auto">
          {/* Social Links Only */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Social Media Panel */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 hidden dark:block"></div>
              <div className="relative dark:bg-slate-900/80 bg-white backdrop-blur-xl rounded-3xl p-8 border dark:border-slate-700/50 border-slate-100 shadow-lg dark:shadow-none">
                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-6 text-center">Connect With Me</h3>
                <div className="grid gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={social.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="w-full"
                    >
                      <a
                        href={social.url}
                        target={social.name === 'Email' ? undefined : "_blank"}
                        rel={social.name === 'Email' ? undefined : "noopener noreferrer"}
                        className={`group flex items-center gap-4 p-4 bg-gradient-to-r ${social.color} rounded-xl text-white transition-all duration-300 ${social.hoverColor} hover:shadow-xl cursor-pointer block w-full`}
                      >
                        <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {social.icon}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold">{social.name}</span>
                          <p className="text-sm opacity-90">{social.name === 'Email' ? 'Send me an email' : 'Follow me'}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaReply className="rotate-180" />
                        </div>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #10b981);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #059669);
        }
      `}</style>
    </section>
  );
};

export default Contact;