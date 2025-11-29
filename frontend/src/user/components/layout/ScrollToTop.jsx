import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ smooth = false }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, [pathname, smooth]);

  return null;
};

export default ScrollToTop;
