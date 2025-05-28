import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createArticle, updateArticle } from '../components/Api/Api'

export const submitArticle = createAsyncThunk(
  'postForm/submitArticle',
  async ({ articleData, slug }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      if (slug) {
        return await updateArticle(slug, articleData, auth.token)
      }
      return await createArticle(articleData, auth.token)
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const PostFormSlice = createSlice({
  name: 'postForm',
  initialState: {
    status: 'idle',
    error: null,
    formData: {
      title: '',
      description: '',
      body: '',
      tagList: [],
    },
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    resetForm: (state) => {
      state.status = 'idle'
      state.error = null
      state.formData = {
        title: '',
        description: '',
        body: '',
        tagList: [],
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitArticle.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(submitArticle.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(submitArticle.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { setFormData, resetForm } = PostFormSlice.actions
export default PostFormSlice.reducer
