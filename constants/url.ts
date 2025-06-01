export const API_URL = {
    POSTS: {
        ROOT: "/posts",
        BY_ID: (id: string) => `/posts/${id}`,
    },
    USERS: {
        ROOT: "/users",
        BY_ID: (id: string) => `/users/${id}`,
    },
    COMMENTS: {
        ROOT: "/comments",
        BY_ID: (id: string) => `/comments/${id}`,
        BY_POST_ID: (postId: string) => `/comments?postId=${postId}`,
    },
    LABELS: {
        ROOT: "/labels",
        BY_ID: (id: string) => `/labels/${id}`,
    },

    LIKES: {
        ROOT: "/likes", 
        BY_ID: (id: string) => `/likes/${id}`,
        BY_POST_ID: (postId: string) => `/likes?postId=${postId}`,
    },
    // Tambahkan entitas lainnya di sini
};


export const API_PUBLIC_URL = {
  POSTS: {
    ROOT: "/posts",
    BY_SLUG: (slug: string) => `/posts/${slug}`,
  },
  COMMENTS: {
    BY_POST_ID: (postId: string) => `/comments?postId=${postId}`,
  },
  LABELS: {
    ROOT: "/labels",
  },
};