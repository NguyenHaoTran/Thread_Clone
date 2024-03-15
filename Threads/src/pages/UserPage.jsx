import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

const UserPage = () => {
  return <>
    <UserHeader />
    <UserPost day={3} likes={123456} replies={434} postImg="/post1.png" postTitle="Lets wtf?"/>
    <UserPost day={1} likes={4546} replies={21} postImg="/post2.png" postTitle="OK??"/>
    <UserPost day={5} likes={678} replies={1212}  postTitle="wtf is this?"/>
    <UserPost day={5} likes={122} replies={123456} postImg="/post3.png" postTitle="ass hold?"/>
    
  </>
}

export default UserPage