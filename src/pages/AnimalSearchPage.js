import React, { useState } from 'react';
import axios from 'axios';
import '../components/styles/AnimalSearchPage.css';

function AnimalSearchPage() {
    const [animals, setAnimals] = useState([]);
    const [filters, setFilters] = useState({
        bgnde: '', // 검색 시작일
        endde: '', // 검색 종료일
        upkind: '', // 축종코드
        upr_cd: '', // 시도코드
        org_cd: '', // 시군구코드
        state: '', // 상태
        neuter_yn: '', // 중성화 여부
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_KEY = process.env.REACT_APP_ANIMAL_API_KEY; // 디코딩된 API 키

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                serviceKey: API_KEY, // 디코딩된 키 사용
                bgnde: filters.bgnde?.replace(/-/g, '') || '',
                endde: filters.endde?.replace(/-/g, '') || '',
                upkind: filters.upkind || '',
                upr_cd: filters.upr_cd || '',
                org_cd: filters.org_cd || '',
                state: filters.state || '',
                neuter_yn: filters.neuter_yn || '',
                _type: 'json',
                pageNo: 1,
                numOfRows: 10,
            };

            const response = await axios.get(
                'http://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic',
                { params }
            );

            const body = response?.data?.response?.body;
            if (body?.items?.item) {
                setAnimals(body.items.item);
            } else {
                setAnimals([]);
                setError('데이터가 없습니다.');
            }
        } catch (err) {
            console.error('데이터를 가져오는 중 오류 발생:', err);
            setError('데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <div className="animal-search-page">
            <h1>유기동물 조회</h1>

            {/* 검색 필터 */}
            <div className="search-bar">
                <input
                    type="date"
                    name="bgnde"
                    onChange={handleInputChange}
                    placeholder="검색 시작일"
                />
                <input
                    type="date"
                    name="endde"
                    onChange={handleInputChange}
                    placeholder="검색 종료일"
                />
                <select name="upkind" onChange={handleInputChange}>
                    <option value="">종류</option>
                    <option value="417000">강아지</option>
                    <option value="422400">고양이</option>
                    <option value="429900">기타</option>
                </select>
                <select name="upr_cd" onChange={handleInputChange}>
                    <option value="">시도 선택</option>
                    <option value="6110000">서울특별시</option>
                    <option value="6260000">부산광역시</option>
                    <option value="6270000">대구광역시</option>
                </select>
                <select name="state" onChange={handleInputChange}>
                    <option value="">상태</option>
                    <option value="notice">공고중</option>
                    <option value="protect">보호중</option>
                </select>
                <select name="neuter_yn" onChange={handleInputChange}>
                    <option value="">중성화 여부</option>
                    <option value="Y">예</option>
                    <option value="N">아니오</option>
                    <option value="U">미상</option>
                </select>
                <button onClick={handleSearch}>검색</button>
            </div>

            {/* 로딩 상태 */}
            {loading && <p>로딩 중...</p>}

            {/* 에러 메시지 */}
            {error && <p className="error">{error}</p>}

            {/* 유기동물 목록 */}
            <div className="animal-list">
                {animals.map((animal) => (
                    <div key={animal.desertionNo} className="animal-item">
                        <img src={animal.popfile} alt={animal.kindCd} className="animal-image" />
                        <div className="animal-info">
                            <h3>{animal.kindCd}</h3>
                            <p>발견 장소: {animal.happenPlace}</p>
                            <p>접수일: {animal.happenDt}</p>
                            <p>보호소: {animal.careNm}</p>
                            <p>보호소 주소: {animal.careAddr}</p>
                            <p>연락처: {animal.careTel}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AnimalSearchPage;
