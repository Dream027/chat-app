type MainLayoutProps = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1fr_2fr]">
            <div className=""></div>
            <div className=""></div>
        </div>
    );
}
