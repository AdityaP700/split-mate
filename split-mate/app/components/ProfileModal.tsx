//app/components/ProfileModal.tsx
import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // <-- ADD THIS LINE
import { toast } from 'react-toastify';
export default function ProfileModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'signing' | 'success'>('form');
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !username) return;

    setIsLoading(true);
    setStep('signing');
    
    try {
      // 1. Get user to sign the registration message
      const message = `Registering @${username} for SplitMate`;
      const signature = await signMessageAsync({ message });

      // 2. Call the registration API
      await axios.post('/api/register', {
        address,
        username,
        signature
      });

      // 3. Show success state
      setStep('success');
      toast.success('🎉 Profile registered successfully!', {
        className: "bg-gradient-to-r from-green-400 to-blue-500 text-white"
      });
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
        router.push('/dashboard'); // <-- REDIRECT AFTER SUCCESS
        }, 2000);
    } catch (error: any) {
      setStep('form');
      toast.error(error.response?.data?.message || 'Failed to register profile', {
        className: "bg-gradient-to-r from-red-400 to-pink-500 text-white"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setStep('form');
      setUsername('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl opacity-20 blur"></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8">
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Form Step */}
          {step === 'form' && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Create Your Profile
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a unique username for your SplitMate account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">@</span>
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl
                                focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400
                                text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                                transition-all duration-200 text-lg font-medium
                                group-hover:border-gray-300 dark:group-hover:border-gray-500"
                      placeholder="username"
                      pattern="[a-z0-9]+"
                      title="Lowercase letters and numbers only"
                      required
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 transition-opacity duration-200"
                           style={{ opacity: username.length > 2 ? 1 : 0 }}>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Only lowercase letters and numbers are allowed
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-4 px-6 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                              hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl font-semibold
                              transition-all duration-200 border-2 border-transparent
                              hover:border-gray-300 dark:hover:border-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || username.length < 3}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 
                              hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl
                              shadow-lg hover:shadow-xl transition-all duration-200
                              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
                              transform hover:scale-105 active:scale-95"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Signing Step */}
          {step === 'signing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Sign to Continue
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please sign the message in your wallet to complete registration
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                  Message: "Registering @{username} for SplitMate"
                </p>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Profile Created!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Welcome to SplitMate, @{username}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <span>Redirecting you now...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}