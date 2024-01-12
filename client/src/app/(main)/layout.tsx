import SidebarChatView from "@/components/SidebarChatView";

type MainLayoutProps = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="grid h-screen w-full grid-cols-1 lg:grid-cols-[1fr_2fr]">
            <SidebarChatView />
            {children}
        </div>
    );
}
