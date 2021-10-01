export const getPopular = () => fetch(`https://api.themoviedb.org/3/movie/popular?api_key=2be0c0fc4fb985246d2226af126346c2&language=en-US&region=TW&page=1`)
.then((res) => res.json())

export const getMovieRating = (id) => fetch(`http://www.omdbapi.com/?i=${id}&apikey=382fad7&tomatoes=true`)
.then((res) => res.json())

export const getIMDBID = (id) => fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=2be0c0fc4fb985246d2226af126346c2`)
.then((res) => res.json())

export const getSearchData = (value, page=1) => fetch(`https://api.themoviedb.org/3/search/multi?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW&query=${value}&page=${page}`)
.then((res) => res.json())

export const getMovieDeatil = (id) => fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW&append_to_response=keywords,external_ids`)
.then((res) => res.json())

export const getRecommendations = (id) => fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW`)
.then((res) => res.json())

export const getSimilar = (id) => fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW`)
.then((res) => res.json())

export const getCredits = (id) => fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW`)
.then((res) => res.json())

export const getTrend = () => fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW`)
.then((res) => res.json())

export const getGenre = () => fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=2be0c0fc4fb985246d2226af126346c2&language=en-US`)
.then((res) => res.json())

export const getGenreSearch = (id, page=1) => fetch(`https://api.themoviedb.org/3/discover/movie?api_key=2be0c0fc4fb985246d2226af126346c2&language=en-US&region=TW&with_genres=${id}&page=${page}`)
.then((res) => res.json())

export const getUpcomming = () => fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW&region=TW,US`)
.then((res) => res.json())

export const getPopularPeople = () => fetch(`https://api.themoviedb.org/3/person/popular?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW`)
.then((res) => res.json())

export const getVideo = (id) => fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=2be0c0fc4fb985246d2226af126346c2`)
.then((res) => res.json())

export const getPeopleDetail = (id) => fetch(`https://api.themoviedb.org/3/person/${id}?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW&append_to_response=images,tagged_images`)
.then((res) => res.json())

export const getPeopleDetailEng = (id) => fetch(`https://api.themoviedb.org/3/person/${id}?api_key=2be0c0fc4fb985246d2226af126346c2&language=en-US`)
.then((res) => res.json())

export const getPeopleMovies = (id) => fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=2be0c0fc4fb985246d2226af126346c2&language=zh-TW`)
.then((res) => res.json())

export const getMovieImage = (id) => fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=2be0c0fc4fb985246d2226af126346c2`)
.then((res) => res.json())