import React, { useState, useEffect } from 'react';
import '../components/styles/MyPage.css';
import apiClient from './../utils/apiClient';

function MyPage() {
  const [activeCategory, setActiveCategory] = useState('home'); // 현재 선택된 카테고리
  const [inquiries, setInquiries] = useState([]); // 문의 내역 저장

  // 문의 내역 가져오기
  useEffect(() => {
    if (activeCategory === 'myInquiries') {
      const fetchInquiries = async () => {
        try {
          const response = await apiClient.get('/api/inquiries');
          setInquiries(response.data);
        } catch (error) {
          console.error('문의 내역 불러오기 실패:', error.response?.data || error.message);
        }
      };
      fetchInquiries();
    }
  }, [activeCategory]);

  const renderContent = () => {
    switch (activeCategory) {
      case 'home':
        return <h2>홈 화면</h2>;
      case 'account':
        return (
          <div>
            <h2>내 정보 관리</h2>
            <p>회원 정보를 관리할 수 있습니다.</p>
          </div>
        );
      case 'myPosts':
        return (
          <div>
            <h2>내가 작성한 글</h2>
            <p>내가 작성한 글 목록을 확인할 수 있습니다.</p>
          </div>
        );
      case 'myComments':
        return (
          <div>
            <h2>댓글 단 글</h2>
            <div className="activity-card">
              <p>08/10 03:23 - Lorem Ipsum</p>
              <p>내용: 글230 | 나이: 29 - 40대</p>
            </div>
          </div>
        );
      case 'likedPosts':
        return (
          <div>
            <h2>좋아요 표시한 글</h2>
            <p>좋아요를 누른 글 목록을 확인할 수 있습니다.</p>
          </div>
        );
      case 'myVolunteer':
        return (
          <div>
            <h2>나의 봉사 활동 내역</h2>
            <ul>
              <li>2024-01-15: 유기동물 보호소 청소</li>
              <li>2024-02-20: 유기견 산책 도우미</li>
              <li>2024-03-10: 고양이 보호소 음식 준비</li>
            </ul>
          </div>
        );
      case 'myInquiries': // 새로운 카테고리 추가
        return (
          <div>
            <h2>나의 문의 내역</h2>
            {inquiries.length === 0 ? (
              <p>문의 내역이 없습니다.</p>
            ) : (
              <div className="inquiry-list">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="inquiry-card">
                    <p className="inquiry-date">
                      <strong>날짜:</strong> {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                    <p className="inquiry-content">
                      <strong>내용:</strong> {inquiry.content}
                    </p>
                    {inquiry.reply && (
                <p className="inquiry-reply">
                  <strong>관리자 답변:</strong> {inquiry.reply}
                </p>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return <h2>잘못된 카테고리</h2>;
    }
  };

  return (
    <div className="mypage-container">
      {/* 왼쪽 사이드바 */}
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
                댓글 단 글
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
                className={activeCategory === 'myVolunteer' ? 'active' : ''}
                onClick={() => setActiveCategory('myVolunteer')}
              >
                나의 봉사 활동 내역
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

      {/* 메인 콘텐츠 */}
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default MyPage;
