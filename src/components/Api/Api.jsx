import axios from 'axios'

const API_URL = 'https://blog-platform.kata.academy/api'
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      user: userData,
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, {
      user: userData,
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const fetchArticles = async (offset = 0, limit = 5, token = null) => {
  try {
    const config = token
      ? {
          headers: { Authorization: `Token ${token}` },
        }
      : {}
    const response = await axios.get(`${API_URL}/articles`, {
      params: { offset, limit },
      ...config,
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const likeArticle = async (slug, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/articles/${slug}/favorite`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const unLikeArticle = async (slug, token) => {
  try {
    const response = await axios.delete(`${API_URL}/articles/${slug}/favorite`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const getArticleBySlug = async (slug, token = null) => {
  try {
    const config = token
      ? {
          headers: { Authorization: `Token ${token}` },
        }
      : {}

    const response = await axios.get(`${API_URL}/articles/${slug}`, config)
    return response.data.article
  } catch (error) {
    throw error.response.data
  }
}

export const deleteArticle = async (slug, token) => {
  try {
    await axios.delete(`${API_URL}/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  } catch (error) {
    throw error.response.data
  }
}

export const updateArticle = async (slug, articleData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/articles/${slug}`,
      {
        article: articleData,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
    return response.data.article
  } catch (error) {
    throw error.response.data
  }
}

export const createArticle = async (articleData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/articles`,
      {
        article: articleData,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
    return response.data.article
  } catch (error) {
    throw error.response.data
  }
}

export const updateUser = async (userData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/user`,
      {
        user: userData,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    throw error.response.data
  }
}
