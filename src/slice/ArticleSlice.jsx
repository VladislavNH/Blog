import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getArticleBySlug as apiGetArticleBySlug } from '../components/Api/Api'

export const getArticleBySlug = createAsyncThunk(
  'article/getArticleBySlug',
  async ({ slug, token }, { rejectWithValue }) => {
    try {
      const response = await apiGetArticleBySlug(slug, token)
      return response.article
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Unknown error' })
    }
  }
)

const articleSlice = createSlice({
  name: 'article',
  initialState: {
    data: null,
    loading: false,
    error: null,
    deleting: false,
  },
  reducers: {
    clearArticle(state) {
      state.data = null
      state.loading = false
      state.error = null
      state.deleting = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticleBySlug.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getArticleBySlug.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(getArticleBySlug.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Error loading article'
      })
  },
})

export const { clearArticle } = articleSlice.actions

export default articleSlice.reducer
