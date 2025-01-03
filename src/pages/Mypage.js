import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/MyPage.css';
import apiClient from './../utils/apiClient';

function MyPage() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [userInfo, setUserInfo] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await apiClient.get('/api/users/session');
        setUserInfo(response.data);
      } catch (error) {
        console.error('사용자 세션 불러오기 실패:', error.response?.data || error.message);
      }
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeCategory === 'myPosts') {
          const response = await apiClient.get('/api/mypage/myposts');
          setMyPosts(response.data);
        } else if (activeCategory === 'myComments') {
          const response = await apiClient.get('/api/mypage/mycomments');
          setMyComments(response.data);
        } else if (activeCategory === 'likedPosts') {
          const response = await apiClient.get('/api/mypage/likedposts');
          setLikedPosts(response.data);
        } else if (activeCategory === 'myInquiries') {
          const response = await apiClient.get('/api/inquiries');
          setInquiries(response.data);
        }
      } catch (error) {
        console.error(`${activeCategory} 데이터 불러오기 실패:`, error.response?.data || error.message);
      }
    };

    if (activeCategory !== 'home' && activeCategory !== 'account') {
      fetchData();
    }
  }, [activeCategory]);

  const renderContent = () => {
    switch (activeCategory) {
      case 'home':
        return <h2>홈 화면</h2>;

      case 'account':
        return (
          <div>
            <h2>내 정보</h2>
            {userInfo ? (
              <div className="user-info">
                <p>
                  <strong>이름:</strong> {userInfo.username}
                </p>
                <p>
                  <strong>이메일:</strong> {userInfo.email}
                </p>
                <p>
                  <strong>전화번호:</strong> {userInfo.phoneNumber || '등록되지 않음'}
                </p>
                <p>
                  <strong>가입일:</strong> {new Date(userInfo.createdAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p>정보를 불러오는 중...</p>
            )}
          </div>
        );

      case 'myPosts':
      case 'myComments':
      case 'likedPosts':
        const items = activeCategory === 'myPosts'
          ? myPosts
          : activeCategory === 'myComments'
          ? myComments
          : likedPosts;

        return (
          <div>
            <h2>
              {activeCategory === 'myPosts'
                ? '내가 작성한 글'
                : activeCategory === 'myComments'
                ? '댓글 단 글'
                : '좋아요 표시한 글'}
            </h2>
            <div className="grid-container">
              {items.length === 0 ? (
                <p>목록이 비어 있습니다.</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="grid-item"
                    onClick={() =>
                      navigate(
                        `/freeboard/${
                          item.postId || item.id
                        }`
                      )
                    }
                  >
                    <div className="grid-item-title">{item.title || item.postTitle}</div>
                    <div className="grid-item-content">{item.content}</div>
                    <div className="grid-item-date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'myInquiries':
        return (
          <div>
            <h2>나의 문의 내역</h2>
            <div className="list-container">
              {inquiries.length === 0 ? (
                <p>문의 내역이 없습니다.</p>
              ) : (
                inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="list-item">
                    <div className="list-item-title">문의 내용</div>
                    <div className="list-item-content">{inquiry.content}</div>
                    <div className="list-item-date">
                      작성일: {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>
                    {inquiry.reply && (
                      <div className="list-item-content">
                        <strong>관리자 답변:</strong> {inquiry.reply}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return <h2>잘못된 카테고리</h2>;
    }
  };

  return (
    <div className="mypage-container">
      <div className="sidebar">
        <div className="logo">My Page</div>
        <nav>
          <ul>
            <li>
              <button
                className={activeCategory === 'home' ? 'active' : ''}
                onClick={() => setActiveCategory('home')}
              >
                홈
              </button>
            </li>
            <li>
              <button
                className={activeCategory === 'account' ? 'active' : ''}
                onClick={() => setActiveCategory('account')}
              >
                내 정보 관리
              </button>
            </li>
            <li>
              <button
                className={activeCategory === 'myPosts' ? 'active' : ''}
                onClick={() => setActiveCategory('myPosts')}
              >
                내가 작성한 글
              </button>
            </li>
            <li>
              <button
                className={activeCategory === 'myComments' ? 'active' : ''}
                onClick={() => setActiveCategory('myComments')}
              >
                내가 쓴 댓글 확인
              </button>
            </li>
            <li>
              <button
                className={activeCategory === 'likedPosts' ? 'active' : ''}
                onClick={() => setActiveCategory('likedPosts')}
              >
                좋아요 표시한 글
              </button>
            </li>
            <li>
              <button
                className={activeCategory === 'myInquiries' ? 'active' : ''}
                onClick={() => setActiveCategory('myInquiries')}
              >
                나의 문의 내역
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default MyPage;
