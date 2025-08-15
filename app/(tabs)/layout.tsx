import BottomNav from '@/components/BottomNav';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-app flex flex-col">
      <main className="flex-1 p-4 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
