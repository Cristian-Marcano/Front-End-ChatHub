import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const Background = () => {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div className="app-container">
            <Sidebar />
            <div className='main-content'>
                <ChatList onSelectChat={setSelectedChat} />
                <ChatWindow chat={selectedChat} />
            </div>
        </div>
    );
};

export default Background;