import React, { useState,useRef,useEffect } from "react";
import {Link} from 'react-router-dom';
import styled from "styled-components";
import Navigation from "../../components/Navigation/Navigation";
import * as f from "../../components/Common/CommonStyle";
import BigStyleCategoryBox from "../../components/Common/BigStyleCategoryBox";
import CoordinatorInfo from "../../components/MainPage/CoordinatorInfo";
import CoordinatorMainImg from "../../components/MainPage/CoordinatorMainImg";
import BottomSheet from "../../components/MainPage/BottomSheet";
import heart from '../../assets/img/heart.svg';
import fillheart from '../../assets/img/fillheart.svg';
import axios from 'axios'; 


const MainText = styled.div`
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  margin-top: 9.12vh;
  margin-bottom: 1.65vh;
`;

const HashTag = styled.div`
  cursor: pointer;  
  white-space: nowrap;
  overflow-x : auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar{
    display:none;
  }
`;

const CoordinatorProfile = styled.div`
  margin-top:3.08vh;
`;
const UserMainPage = () => {
  const initialLikedPosts = {};
  const [selectStyle, setSelectStyle] = useState('이지캐주얼');
  const [dragging, setDragging] = useState(false);
  const [clickPoint, setClickPoint] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState(initialLikedPosts);
  const [mainPage, setMainPage] = useState(null);
  
  const containerRef = useRef(null);

  const handelMouseDownEvent = (e) => {
    setDragging(true);
    if(containerRef.current){
      setClickPoint(e.pageX);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const handelMouseMoveEvent = (e) => {
    if(!dragging) return;

    e.preventDefault();

    if(containerRef.current){
      const walk = e.pageX - clickPoint;
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  }
  const changeStyle = (style) => {
    setSelectStyle(style);
  }

  const openBottonSheet = () => {
    setIsOpen(true)
  }
  // 백엔드 통신
  useEffect(()=>{
    async function fetchMainPage(){
      try{
        axios.defaults.withCredentials=true;
        const res = await axios.get("http://localhost:8080/main/user");
        setMainPage(res.data);
      }catch(error){
        console.error(error);
      }
    }
    fetchMainPage();
  }, [])

  //like function
  const [fillColor, setFillColor] = useState(heart);

  const likeIncrease = (board_id) => {
    console.log(board_id)
    console.log(mainPage.user_board_like) 
    async function fetchLike(){
      try{
          axios.defaults.withCredentials=true;
          const res = await axios.get("http://localhost:8080/user/like?boardId="+board_id);
      }catch(error){
          console.error(error);
      }}
  
    async function fetchLikeCancel() {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get("http://localhost:8080/user/unlike?boardId="+board_id);
      } catch (error) {
        console.error(error);
      }
    }
  
    if (fillColor == fillheart) {
      fetchLikeCancel();
      mainPage.user_board_like.pop(board_id);
    } else {
      fetchLike();
      mainPage.user_board_like.push(board_id);
    }
}

  return (
    <f.Totalframe>
      <f.SubScreen>
        <f.ScreenComponent>
          {/* header */}
          <MainText>인기 아우터들의<br/>코디를 둘러보세요 👀</MainText>
          <HashTag ref={containerRef}
            onMouseDown={handelMouseDownEvent}
            onMouseLeave={() => setDragging(false)}
            onMouseUp={() => setDragging(false)}
            onMouseMove={handelMouseMoveEvent}>
            <BigStyleCategoryBox content={'#미니멀'} onClick={() => changeStyle('미니멀')} isSelected={selectStyle === '미니멀'} />
            <BigStyleCategoryBox content={'#이지캐주얼'} onClick={() => changeStyle('이지캐주얼')} isSelected={selectStyle === '이지캐주얼'} />
            <BigStyleCategoryBox content={'#스트릿'}/>
            <BigStyleCategoryBox content={'#봄 코디'}/>
            
          </HashTag>
          {/* 코디네이터 프로필 */}
          {mainPage?.pages.map((data)=>(
            <CoordinatorProfile>
              <Link to={`/postdetail/${data.board_id}`}>
                <CoordinatorMainImg boardImg={data.board_image}
                likeIncrease={(e) => {
                  e.preventDefault(); // 링크 이동을 막음
                  likeIncrease(data.board_id); // 하트 클릭 이벤트 처리
                }}
                fillColor={mainPage.user_board_like.includes(data.board_id) ? fillheart : heart}/>
              </Link>
            <Link to={`/outerprofile/${data.coordinator_id}`}>
              <CoordinatorInfo name={data.nickname} profileImg={data.profile_image}
              requestCnt={data.request_count} likeCnt={data.total_like} styles={data.styles} linkState={false}/>
            </Link>
          </CoordinatorProfile>
          ))}
        </f.ScreenComponent>
      </f.SubScreen>
      <Navigation type={'Home'}/>
    </f.Totalframe>
  );
};

export default UserMainPage;
