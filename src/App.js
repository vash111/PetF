import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CustomerSupport from './pages/CustomerSupport';
import MyPage from './pages/Mypage';
import AnimalSearchPage from './pages/AnimalSearchPage';
import VolunteerSearchPage from './pages/VolunteerSearchPage';
import VolunteerCreatePage from './pages/VolunteerCreatePage';
import ReviewBoardPage from './pages/ReviewBoardPage';
import FreeBoardPage from './pages/FreeBoardPage';
import FreeBoardDetailPage from './pages/FreeBoardDetailPage'
import AdminPage from './pages/AdminPage';
import NoticeBoard from './pages/NoticeBoard';
import NoticeDetail from './pages/NoticeDetail';
import apiClient, { setupInterceptors } from './utils/apiClient';

// UserContext
export const UserContext = React.createContext({
    isLoggedIn: false,
    userInfo: null,
});

function AppRouter({ isLoggedIn }) {
    return (
        <>
            <Header />
            <main style={{ minHeight: '80vh', padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/AboutPage" element={<AboutPage />} />
                    <Route path="/customersupport" element={<CustomerSupport />} />
                    <Route path="/Mypage" element={isLoggedIn ? <MyPage /> : <HomePage />} />
                    <Route path="/animalsearch" element={<AnimalSearchPage />} />
                    <Route path="/VolunteerSearchPage" element={<VolunteerSearchPage />} />
                    <Route path="/VolunteerCreatePage" element={isLoggedIn ? <VolunteerCreatePage /> : <HomePage />} />
                    <Route path="/ReviewBoardPage" element={<ReviewBoardPage />} />
                    <Route path="/FreeBoardPage" element={<FreeBoardPage />} />
                    <Route path="/freeboard/:id" element={<FreeBoardDetailPage />} />
                    <Route path="/AdminPage" element={isLoggedIn ? <AdminPage /> : <HomePage />} />
                    <Route path="/notice-board" element={<NoticeBoard />} />
                    <Route path="/notice-detail/:id" element={<NoticeDetail />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await apiClient.get('/api/users/session');
                setIsLoggedIn(true);
                setUserInfo(response.data);
                console.log('세션 확인 성공:', response.data);
            } catch (error) {
                setIsLoggedIn(false);
                setUserInfo(null);
            }
        };

        fetchUserSession();
    }, []);

    return (
        <UserContext.Provider value={{ isLoggedIn, userInfo }}>
            <Router>
                <AppRouter isLoggedIn={isLoggedIn} />
            </Router>
        </UserContext.Provider>
    );
}

export default App;
