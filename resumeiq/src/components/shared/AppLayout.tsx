import TopAppBar from '@/components/shared/TopAppBar';
import Sidebar from '@/components/shared/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopAppBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 lg:ml-16">
          {children}
        </main>
      </div>
    </div>
  );
}
