import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import PostList from './components/PostList/PostList'
import CreateNewArticle from './components/CreateNewArticle/CreateNewArticle'
import PostOpen from './components/PostOpen/PostOpen'
import EditProfile from './components/EditProfile/EditProfile'
import CreateAcc from './components/CreateAcc/CreateAcc'
import SignIn from './components/SignIn/SignIn'
import AuthSession from './components/Api/AuthSession'

function App() {
  return (
    <div className="App">
      <AuthSession>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PostList />} />
            <Route path="/post-list" element={<PostList />} />
            <Route path="/post-list/page=?:" element={<PostList />} />
            <Route path="/article/:slug" element={<PostOpen />} />
            <Route path="/new-article" element={<CreateNewArticle />} />
            <Route path="/article/:slug/edit" element={<CreateNewArticle />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<CreateAcc />} />
          </Route>
        </Routes>
      </AuthSession>
    </div>
  )
}

export default App