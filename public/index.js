const CLIENT_ID = 'fgbcc-n0SlRCEw';
const SCOPES = ['history', 'identity'];

let upvotedPosts;

const getRedirectUri = () => {
    return window.location.origin + window.location.pathname;
}

const auth = () => {
    const authUri = window.snoowrap.getAuthUrl({
        clientId: CLIENT_ID,
        scope: SCOPES,
        redirectUri: getRedirectUri(),
    });
    
    window.location = authUri;
}

const fetchPosts = async () => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');

    if (!authCode) {
        console.log('No Auth Code 😠 Click Auth first');
        return;
    }

    console.log(`Authenticating with ${authCode}`);

    const reddit = await window.snoowrap.fromAuthCode({
        code: authCode,
        clientId: CLIENT_ID,
        redirectUri: getRedirectUri(),
    });

    console.log('Fetching upvoted posts');
    upvotedPosts = await reddit.getMe().getUpvotedContent().fetchAll();
    console.log('Posts Fetched');
}

const getRandomPost = () => {
    if (!upvotedPosts) {
        console.log('No upvoted posts, make sure you\'ve fetched them');
        return;
    }

    const numberOfPosts = upvotedPosts.length;
    const randomIndex = Math.floor(Math.random() * numberOfPosts);
    const randomPost = upvotedPosts[randomIndex];

    const link = document.getElementById('post-link');
    link.style.display = 'inherit';
    link.href = randomPost.url;

    const linkText = document.getElementById('link-text');
    linkText.innerHTML = randomPost.title;

    const image = document.getElementById('image');
    image.src = randomPost.url;
}
