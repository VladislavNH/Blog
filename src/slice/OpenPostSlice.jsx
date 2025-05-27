import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getArticleBySlug, deleteArticle, likeArticle, unLikeArticle } from '../components/Api/Api'

export const fetchArticle = createAsyncThunk('articles/fetchArticle', async (slug, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    return await getArticleBySlug(slug, auth.token)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const removeArticle = createAsyncThunk('article/deleteArticle', async (slug, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    await deleteArticle(slug, auth.token)
    return slug
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const likePost = createAsyncThunk('article/likePost', async (slug, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    const response = await likeArticle(slug, auth.token)
    return response.article
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const unLikePost = createAsyncThunk('article/unLikePost', async (slug, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    const response = await unLikeArticle(slug, auth.token)
    return response.article
  } catch (error) {
    return rejectWithValue(error)
  }
})

const openPostSlice = createSlice({
  name: 'article',
  initialState: {
    data: null,
    loading: false,
    error: null,
    deleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(removeArticle.pending, (state) => {
        state.deleting = true
      })
      .addCase(removeArticle.fulfilled, (state) => {
        state.deleting = false
        state.data = null
      })
      .addCase(removeArticle.rejected, (state) => {
        state.deleting = false
      })
      .addCase(likePost.fulfilled, (state, action) => {
        if (state.data) {
          state.data = action.payload
        }
      })
      .addCase(unLikePost.fulfilled, (state, action) => {
        if (state.data) {
          state.data = action.payload
        }
      })
  },
})

export default openPostSlice.reducer