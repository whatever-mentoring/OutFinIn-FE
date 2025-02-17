import React, {useState, useEffect} from "react";
import axios from 'axios';
import * as f from "../../components/Common/CommonStyle";
import GobackContainer from "../../components/Common/GobackContainer";
import styled from "styled-components";
import heart from '../../assets/img/heart.svg';
import fillheart from '../../assets/img/fillheart.svg';

const Liketxt = styled.div`
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 0.064px;
    margin-top:19px;
    margin-left: 15px;
`;

const TotalPost = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: relative;
`;
const PostImg = styled.div`
    position: relative;
    margin-top: 8px;
    margin-left: 15px;
`;

const MainImg = styled.img`
    border-radius: 18px;
    width: 172px;
    height: 201px;
    object-fit: cover;
`;

const Postname = styled.div`
    position: absolute;
    z-index: 1;
    bottom:22px;
    left: 16px;
    width: 77.4px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.175px;
`;

const Heart = styled.img`
    position: absolute;
    top: 13.82px;
    right: 13.76px;
`
const LikeCodies = () => {
    const [fillColor, setFillColor] = useState(fillheart);
    const [boardLike, setBoardLike] = useState([]);


    // axios
    useEffect(() => {
        async function fetchData() {
            try {
              axios.defaults.withCredentials = true;
              const res = await axios.get(
                "http://localhost:8080/user/board/like"
              );
              setBoardLike(res.data);
              console.log(res.data)
            } catch (error) {
              console.error(error);
            }
          }
    
          fetchData();
      }, []);
    
      const likeIncrease = (board_id) => {
        console.log(board_id)
        // e.preventDefault(); // 링크 이동을 막음
        setFillColor(fillColor === heart ? fillheart : heart);
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
          boardLike.user_board_like.pop(board_id);
        } else {
          fetchLike();
          boardLike.user_board_like.push(board_id);
        }
    }
    return(
    <f.Totalframe>
      <GobackContainer like/>
          <Liketxt>좋아요 누른 코디</Liketxt>
            <TotalPost>
            {boardLike?.boards?.map((post) => (
                <PostImg key={post.board_id}>
                    <MainImg src={"https://seumu-s3-bucket.s3.ap-northeast-2.amazonaws.com/"+post.image_url} />
                    <Postname>{post.title}</Postname>
                <Heart src={boardLike.user_board_like.includes(post.board_id) ? fillheart : heart}
                onClick={(e)=>likeIncrease(post.board_id,e)}
                />
                </PostImg>
            ))}
            </TotalPost>
    </f.Totalframe>
    )
}
export default LikeCodies;