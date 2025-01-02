import React, { useState } from 'react'; // useEffect 제거
import '../components/styles/AnimalSearchPage.css';

function AnimalSearchPage() {
    const [animals, setAnimals] = useState([
        {
            id: 1,
            image: 'https://via.placeholder.com/100',
            title: '강아지 - 서울특별시',
            date: '2024-01-01',
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/100',
            title: '고양이 - 부산광역시',
            date: '2024-01-02',
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/100',
            title: '기타 - 경기도',
            date: '2024-01-03',
        },
    ]); // 임시 데이터
    const [filters, setFilters] = useState({
        region: '',
        type: '',
        date: '',
    }); // 검색 필터 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const itemsPerPage = 5; // 페이지당 표시할 항목 수

    // useEffect(() => {
    //     fetchData();
    // }, []);

    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get('https://your-api-endpoint.com/animals');
    //         setAnimals(response.data);
    //     } catch (error) {
    //         console.error('데이터를 가져오는 중 오류 발생:', error);
    //     }
    // };

    // const handleSearch = async () => {
    //     try {
    //         const response = await axios.get('https://your-api-endpoint.com/animals', {
    //             params: filters,
    //         });
    //         setAnimals(response.data);
    //         setCurrentPage(1); // 검색 시 페이지 초기화
    //     } catch (error) {
    //         console.error('검색 중 오류 발생:', error);
    //     }
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 페이징 처리
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = animals.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(animals.length / itemsPerPage);

    return (
        <div className="animal-search-page">
            <h1>유기동물 조회</h1>

            {/* 검색창 */}
            <div className="search-bar">
                <select name="region" onChange={handleInputChange}>
                    <option value="">지역 선택</option>
                    <option value="서울특별시">서울특별시</option>
                    <option value="부산광역시">부산광역시</option>
                    <option value="대구광역시">대구광역시</option>
                    <option value="인천광역시">인천광역시</option>
                    <option value="광주광역시">광주광역시</option>
                    <option value="대전광역시">대전광역시</option>
                    <option value="울산광역시">울산광역시</option>
                    <option value="세종특별자치시">세종특별자치시</option>
                    <option value="경기도">경기도</option>
                    <option value="강원도">강원도</option>
                    <option value="충청북도">충청북도</option>
                    <option value="충청남도">충청남도</option>
                    <option value="전라북도">전라북도</option>
                    <option value="전라남도">전라남도</option>
                    <option value="경상북도">경상북도</option>
                    <option value="경상남도">경상남도</option>
                    <option value="제주특별자치도">제주특별자치도</option>
                </select>
                <select name="type" onChange={handleInputChange}>
                    <option value="">종류</option>
                    <option value="강아지">강아지</option>
                    <option value="고양이">고양이</option>
                    <option value="기타">기타</option>
                </select>
                <input
                    type="date"
                    name="date"
                    onChange={handleInputChange}
                    placeholder="날짜 선택"
                />
                <button>검색</button> {/* handleSearch 제거 */}
            </div>

            {/* 유기동물 목록 */}
            <div className="animal-list">
                {currentItems.map((animal) => (
                    <div key={animal.id} className="animal-item">
                        <img src={animal.image} alt={animal.title} className="animal-image" />
                        <div className="animal-info">
                            <h3>{animal.title}</h3>
                            <p>{animal.date}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이징 */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AnimalSearchPage;
