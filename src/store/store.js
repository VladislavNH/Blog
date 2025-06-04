import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../slice/AuthSlice'
import postsSlice from '../slice/PostSlice'
import openPostSlice from '../slice/OpenPostSlice'
import postFormSlice from '../slice/PostFormSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    article: openPostSlice,
    postForm: postFormSlice,
  },
})

export default store
