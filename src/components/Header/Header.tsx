import { useContentStore } from "../../stores/useContentStore.ts";
import { MainContent } from "../../data-objects/enum/index.ts";
import AccountBar from "./AccountBar.tsx";

const Header = () => {
    const { setCurrentContent, currentContent } = useContentStore();

    return (
        <div data-testid="header-element" className="navbar bg-base-300">
            <div className="flex flex-row justify-between w-full">
                <div className="flex gap-2">
                    <button
                        className={`btn btn-ghost ${currentContent === MainContent.PLAYER ? 'btn-active' : ''}`}
                        onClick={() => setCurrentContent(MainContent.PLAYER)}
                    >
                        Player
                    </button>
                    <button
                        className={`btn btn-ghost ${currentContent === MainContent.PLAYLISTS ? 'btn-active' : ''}`}
                        onClick={() => setCurrentContent(MainContent.PLAYLISTS)}
                    >
                        Playlists
                    </button>
                </div>
                <AccountBar />
            </div>
        </div>
    );
};

export default Header;
