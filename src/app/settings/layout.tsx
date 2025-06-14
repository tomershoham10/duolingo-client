'use client';
import AdminSideBar from '@/components/Navigation/AdminSideBar/page';

export default function RecordingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="w-80 flex-shrink-0">
        <AdminSideBar />
      </div>
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
} 