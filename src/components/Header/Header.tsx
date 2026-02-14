import AccountBar from "./AccountBar.tsx";

const Header = () => {
    return (
        <div data-testid="header-element" className="navbar bg-base-300">
            <div className="flex flex-row justify-between w-full">
            </div>
            <AccountBar/>
        </div>
    );
};

export default Header;
