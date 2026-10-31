import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';

export function StorefrontLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default StorefrontLayout;
