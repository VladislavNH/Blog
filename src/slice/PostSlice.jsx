import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchArticles, likeArticle, unLikeArticle } from '../components/Api/Api'

export const getPosts = createAsyncThunk('posts/getPosts', async ({ offset, limit, token }, { rejectWithValue }) => {
  try {
    const response = await fetchArticles(offset, limit, token)
    return {
      articles: response.articles || [],
      articlesCount: response.articlesCount || 0,
      offset,
      limit,
    }
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const likePosts = createAsyncThunk('posts/likePosts', async ({ slug, token }, { rejectWithValue }) => {
  try {
    const response = await likeArticle(slug, token)
    return response.article
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const unLikePost = createAsyncThunk('posts/unLikePost', async ({ slug, token }, { rejectWithValue }) => {
  try {
    const response = await unLikeArticle(slug, token)
    return response.article
  } catch (error) {
    return rejectWithValue(error)
  }
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    articles: [],
    loading: false,
    error: null,
    articlesCount: 0,
    offset: 0,
    limit: 5,
    favorites: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true
        state.error = false
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.articles = action.payload.articles
        state.articlesCount = action.payload.articlesCount
        state.loading = false
        state.offset = action.payload.offset
        state.limit = action.payload.limit
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(likePosts.fulfilled, (state, action) => {
        const index = state.articles.findIndex((a) => a.slug === action.payload.slug)
        if (index !== -1) {
          state.articles[index] = action.payload
        }
      })
      .addCase(unLikePost.fulfilled, (state, action) => {
        const index = state.articles.findIndex((a) => a.slug === action.payload.slug)
        if (index !== -1) {
          state.articles[index] = action.payload
        }
      })
  },
})
export default postsSlice.reducer
