import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import commonStore from './stores/commonStore';
import authStore from './stores/authStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:3000'; //'https://conduit.productionready.io/api';

//const encode = encodeURIComponent;
//const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = (article) => Object.assign({}, article, { _id: undefined });

const handleErrors = (err) => {
	if (err && err.response && err.response.status === 401) {
		authStore.logout();
	}
	return err;
};

const responseBody = (res) => {
	return res;
};

const tokenPlugin = (req) => {
	if (commonStore.token) {
		req.set('authorization', `Bearer ${commonStore.token}`);
	}
};

const requests = {
	del: (url) =>
		superagent
			.del(`${API_ROOT}${url}`)
			.use(tokenPlugin)
			.end(handleErrors)
			.then(responseBody),
	get: (url) =>
		superagent
			.get(`${API_ROOT}${url}`)
			.use(tokenPlugin)
			.end(handleErrors)
			.then(responseBody),
	put: (url, body) =>
		superagent
			.put(`${API_ROOT}${url}`, body)
			.use(tokenPlugin)
			.end(handleErrors)
			.then(responseBody),
	post: (url, body) =>
		superagent
			.post(`${API_ROOT}${url}`, body)
			.use(tokenPlugin)
			.end(handleErrors)
			.then(responseBody)
};

const Users = {
	login: (email, password) => requests.post('/users/auth', { email, password }),
	register: (name, email, password) => requests.post('/users/register', { email, name, password }),
	all: () => requests.get('/users'),
	find: (userId) => requests.get('/users/' + userId),
	save: (userId, user) => requests.put('/users/' + userId, { user }),
	update: (userId, user) => requests.put('/users/' + userId, { user }),
	delete: (userId) => requests.del('/users/' + userId),
	exists: (email) => requests.get('/users/exists/' + email)
};

const Auth = {
	login: (email, password) => Users.login(email, password),
	register: (name, email, password) => Users.register({ email, name, password }),
	save: (userId, user) => Users.update(userId, { user }),
	exists: (email) => Users.exists(email)
};

const Wallets = {
	all: () => requests.get(`/wallets`),
	findByUser: (userId) => requests.get(`/wallets?userId=${userId}`),
	update: (wallet) => requests.put(`/wallets/${wallet._id}`, { wallet: omitSlug(wallet) }),
	create: (wallet) => requests.post('/wallets', { wallet }),
	get: (id) => requests.get(`/wallets/${id}`),
	del: (id) => requests.del(`/wallets/${id}`)
	//all: (page, lim = 10) => requests.get(`/wallets?${limit(lim, page)}`),
	// byAuthor: (author, page, query) => requests.get(`/wallets?author=${encode(author)}&${limit(5, page)}`),
	// byTag: (tag, page, lim = 10) => requests.get(`/wallets?tag=${encode(tag)}&${limit(lim, page)}`),
	// favorite: (slug) => requests.post(`/wallets/${slug}/favorite`),
	// favoritedBy: (author, page) => requests.get(`/wallets?favorited=${encode(author)}&${limit(5, page)}`),
	// feed: () => requests.get('/wallets/feed?limit=10&offset=0'),
	// unfavorite: (slug) => requests.del(`/wallets/${slug}/favorite`)
};

// const Tags = {
//    getAll: () => requests.get('/tags')
// };

// const Articles = {
//    all: (page, lim = 10) => requests.get(`/articles?${limit(lim, page)}`),
//    byAuthor: (author, page, query) => requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
//    byTag: (tag, page, lim = 10) => requests.get(`/articles?tag=${encode(tag)}&${limit(lim, page)}`),
//    del: (slug) => requests.del(`/articles/${slug}`),
//    favorite: (slug) => requests.post(`/articles/${slug}/favorite`),
//    favoritedBy: (author, page) => requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
//    feed: () => requests.get('/articles/feed?limit=10&offset=0'),
//    get: (slug) => requests.get(`/articles/${slug}`),
//    unfavorite: (slug) => requests.del(`/articles/${slug}/favorite`),
//    update: (article) => requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
//    create: (article) => requests.post('/articles', { article })
// };

// const Comments = {
//    create: (slug, comment) => requests.post(`/articles/${slug}/comments`, { comment }),
//    delete: (slug, commentId) => requests.del(`/articles/${slug}/comments/${commentId}`),
//    forArticle: (slug) => requests.get(`/articles/${slug}/comments`)
// };

// const Profile = {
//    follow: (username) => requests.post(`/profiles/${username}/follow`),
//    get: (username) => requests.get(`/profiles/${username}`),
//    unfollow: (username) => requests.del(`/profiles/${username}/follow`)
// };

export default {
	//Articles,
	Auth,
	Wallets
	//Comments,
	// Profile
	//Tags
};
