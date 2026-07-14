import React, { useState } from 'react';
import { api } from '../../lib/api';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const Unsubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      setStatus('idle');
      setErrorMessage('');
      
      await api.post('/newsletter/unsubscribe', { email });
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.error?.message || 'Failed to unsubscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-md text-center">
      <h1 className="text-3xl font-bold mb-4">Unsubscribe</h1>
      
      {status === 'success' ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Successfully Unsubscribed</h2>
          <p className="text-muted-foreground mb-6">
            You will no longer receive newsletter updates from us. We're sorry to see you go!
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-primary hover:underline text-sm"
          >
            Unsubscribe another email
          </button>
        </div>
      ) : (
        <div>
          <p className="text-muted-foreground mb-8">
            Enter your email address below to unsubscribe from our newsletter.
          </p>
          
          <form onSubmit={handleUnsubscribe} className="space-y-4 text-left">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                placeholder="your.email@example.com"
              />
            </div>
            
            {status === 'error' && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md text-sm">
                <XCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-destructive text-destructive-foreground py-2 rounded-md font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 flex justify-center items-center h-10"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unsubscribe'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
