import ThemeToggle from "@/app/components/ThemeToggle";
import {useTheme} from "@/app/hooks/useTheme";

const Layout = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className={`min-h-screen w-full bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-800 dark:to-indigo-900 p-4 sm:p-8 transition-colors duration-300`}>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <div className="max-w-2xl mx-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;