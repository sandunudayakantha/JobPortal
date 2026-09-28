import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/shared/Navbar';
import FloatingActions from '../components/FloatingActions';
import Footer from '../components/shared/Footer';
import AIAssistant from '../components/AIAssistant';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector(store => store.auth);

  // Don't show floating actions or chat on login/signup pages
  const hideOnPaths = [
    '/login',
    '/signup'
  ];

  // Check if current path starts with any of the hide paths
  const shouldHideActions = hideOnPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      <Navbar />
      <div className="w-[100%] max-w-[1920px] mx-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }>
          {children}
        </Suspense>
      </div>
      {!shouldHideActions && <FloatingActions />}
      {!shouldHideActions && location.pathname !== '/ai-assistant' && <AIAssistant />}
      <Footer />
    </div>
  );
};

export default MainLayout;
 